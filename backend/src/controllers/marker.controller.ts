import { Request, Response } from "express";
import { IMarker, Marker } from "../models/marker.model";

/**
 * Controller to handle the creation of a new marker.
 * Expects a request body with 'coordinate' and 'title'.
 * Responds with the created marker or an error message.
 */
export async function createMarker(req: Request, res: Response) {
    const { coordinate, title } = req.body as IMarker;

    // Only allow authenticated users to create markers
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    // Validate the request body
    if (!coordinate || !title) {
        return res.status(400).json({ error: "Coordinate and title are required" });
    }

    try {
        // Create a new marker instance and save it to the database
        const newMarker = new Marker({ coordinate, title });
        await newMarker.save();
        // Respond with the created marker
        res.status(201).json(newMarker);
    } catch (error) {
        console.error("Error creating marker:", error);
        // Respond with an error if something goes wrong
        res.status(500).json({ msg: "Internal server error", error });
    }
}

/**
 * Controller to fetch all markers from the database.
 * Responds with a list of markers or an error message.
 */
export async function getAllMarkers(req: Request, res: Response) {
    try {
        // Fetch all markers from the database
        const markers = await Marker.find();
        // Respond with the list of markers
        res.status(200).json(markers);
    } catch (error) {
        console.error("Error fetching markers:", error);
        // Respond with an error if something goes wrong
        res.status(500).json({ msg: "Internal server error", error });
    }
}