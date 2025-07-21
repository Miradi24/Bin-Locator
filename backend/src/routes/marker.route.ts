import { Router } from "express";
import { createMarker, getAllMarkers } from "../controllers/marker.controller";

// A router for handling marker related API requests
export const markerRouter = Router();

// API Rrute to create a new marker
markerRouter.post('/', createMarker);
// API Route to get all markers
markerRouter.get('/', getAllMarkers);