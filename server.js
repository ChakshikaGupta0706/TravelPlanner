import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import tripRoutes from "./routes/trip.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const _dirname = path.resolve();

connectDB();

app.use(express.json());

app.use("/api/trips", tripRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
})
