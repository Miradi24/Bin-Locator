import { Document, model, Schema } from "mongoose";

// An interface representing the structure of a marker
export interface IMarker extends Document {
    coordinate: {
        latitude: number;
        longitude: number;
        latitudeDelta?: number;
        longitudeDelta?: number;
    };
    id: string;
    title: string;
}

// Mongoose schema for the marker model
const MarkerSchema = new Schema<IMarker>({
    coordinate: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitudeDelta: { type: Number, required: false },
        longitudeDelta: { type: Number, required: false },
    },
    title: { type: String, required: true },
}, {
    timestamps: true,
});

// Create the Mongoose model for the marker
export const Marker = model<IMarker>('Marker', MarkerSchema);