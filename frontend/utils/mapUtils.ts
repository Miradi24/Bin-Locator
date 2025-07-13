import { Coordinates } from '@/constants/coordinates';
import { IMarker } from '@/types/map';

export function generateRandomMarkers(centerLat: number, centerLng: number, count: number): IMarker[] {
    const markers: IMarker[] = [];
    for (let i = 0; i < count; i++) {
        // Generate random offsets (roughly within 1km)
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        markers.push({
            coordinate: {
                latitude: centerLat + latOffset,
                longitude: centerLng + lngOffset,
                latitudeDelta: Coordinates.latitudeDelta,
                longitudeDelta: Coordinates.longitudeDelta,
            },
            id: `${Date.now().toString()}${i}`,
            title: `Bin ${i + 1}`,
        });
    }
    return markers;
}