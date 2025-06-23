import express from "express";

import { deleteTrip, getAllTrips, saveTrip, updateTrip } from "../controllers/trip.controller.js";

const router = express.Router();

router.get("/", getAllTrips);
router.post("/", saveTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;