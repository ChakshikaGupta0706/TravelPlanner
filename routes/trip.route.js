import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { deleteTrip, getAllTrips, saveTrip, updateTrip } from "../controllers/trip.controller.js";

const router = express.Router();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use absolute path to uploads directory
        const uploadPath = path.resolve('uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

// Routes
router.get("/", getAllTrips);
router.post("/", upload.single('image'), saveTrip); // Add multer middleware
router.put("/:id", upload.single('image'), updateTrip); // Add multer middleware
router.delete("/:id", deleteTrip);

router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching trip' });
  }
});


export default router;