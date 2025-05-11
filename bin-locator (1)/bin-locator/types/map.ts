export interface IMarker {
    coordinate: {
        latitude: number;
        longitude: number;
        latitudeDelta?: number;
        longitudeDelta?: number;
    };
    id: string;
    title: string;
}
