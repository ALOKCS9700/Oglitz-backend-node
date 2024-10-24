import express from "express";
import {
  createIsland,
  getAllIslands,
  getIslandById,
  updateIsland,
  deleteIsland,
  createIslandImage,
  getIslandImagesByIslandId,
} from "../controller/islandsController.js";

const router = express.Router();

// Island APIs
router.post("/islands", createIsland); // Create a new island
router.get("/islands", getAllIslands); // Get all islands with pagination
router.get("/islands/:id", getIslandById); // Get an island by ID
router.put("/islands/:id", updateIsland); // Update an island by ID
router.delete("/islands/:id", deleteIsland); // Delete an island by ID

// Create a new island image
router.post("/island-images", createIslandImage);

// Get all images for a specific island
router.get("/island-images", getIslandImagesByIslandId);


export default router;
