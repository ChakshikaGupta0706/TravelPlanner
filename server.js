
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { connectDB } from "./config/db.js";
import tripRoutes from "./routes/trip.route.js";

dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use("/api/trips", tripRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
} else {
    // For development - serve the HTML file
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });
}

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html", "newtrip.html", "savedtrips.html"));
    });
} else {
    // For development - serve the HTML file
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html", "newtrip.html", "savedtrips.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});