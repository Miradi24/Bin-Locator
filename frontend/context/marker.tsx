import { IMarker } from '@/types/map';
import axios from 'axios';
import { createContext, ReactNode, useState, useMemo, useEffect } from 'react';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// The context type defines the structure of the marker state and methods
interface MarkerContextType {
    markers: IMarker[];
    addMarker: (marker: IMarker) => Promise<void>;
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
        try {
            // Send the marker data to the backend
            const response = await api.post('/markers', marker);
            // If successful, update the markers state
            if (response.status === 201) {
                setMarkers((prevMarkers) => [...prevMarkers, response.data]);
            }
        } catch (error) {
            console.error('Failed to add marker:', error);
            throw error;
        }
    };

    // Memoize the context value to avoid unnecessary re-renders
    const value = useMemo(() => ({ markers, addMarker }), [markers]);

    return <MarkerContext.Provider value={value}>{children}</MarkerContext.Provider>;
}
