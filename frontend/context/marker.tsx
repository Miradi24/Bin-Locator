import { IMarker } from '@/types/map';
import axios from 'axios';
import { createContext, ReactNode, useState, useMemo, useEffect, useContext } from 'react';

// Create an axios instance
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// The context type defines the structure of the marker state and methods
interface MarkerContextType {
    markers: IMarker[];
    addMarker: (marker: Partial<IMarker>) => Promise<void>;
}

const MarkerContext = createContext<MarkerContextType | null>(null);

// MarkerProvider component to wrap around the app and provide marker context
export function MarkerProvider({ children }: { children: ReactNode }) {
    const [markers, setMarkers] = useState<IMarker[]>([]);

    useEffect(() => {
        // Fetch initial markers from the backend when the provider mounts
        const getAllMarkers = async () => {
            try {
                const response = await api.get('/markers');
                // Strip data to only include properties needed for IMarker
                const markersData = response.data.map((marker: any) => {
                    return {
                        coordinate: marker.coordinate,
                        title: marker.title,
                        id: marker._id,
                    };
                });
                setMarkers(markersData);
            } catch (error) {
                console.error('Failed to fetch markers:', error);
            }
        };

        getAllMarkers();
    }, []);

    // Because we don't need an id when adding a new marker, we can use Partial<IMarker>
    const addMarker = async (marker: Partial<IMarker>) => {
        // Send the marker data to the backend
        const response = await api.post('/markers', marker);
        // If successful, update the markers state
        if (response.status === 201) {
            setMarkers((prevMarkers) => [
                ...prevMarkers,
                { coordinate: response.data.coordinate, title: response.data.title, id: response.data._id },
            ]);
        }
    };

    // Memoize the context value to avoid unnecessary re-renders
    const value = useMemo(() => ({ markers, addMarker }), [markers]);

    return <MarkerContext.Provider value={value}>{children}</MarkerContext.Provider>;
}

// Custom hook to use the marker context
// This allows components to access the marker state and methods easily
export function useMarker() {
    const context = useContext(MarkerContext);
    if (!context) {
        throw new Error('useMarker must be used within a MarkerProvider');
    }
    return context;
}
