import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import Experience from "./models/Experience.js";
import Project from "./models/Project.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: "Failed to load experiences" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects." });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res
        .status(404)
        .json({ error: `Project with id: ${req.params.id} not found!` });
    } else {
      res.json(project);
    }
  } catch (err) {
    res.status(400).json({ error: `Error!` });
    console.error(err);
  }
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB!!");
} catch (err) {
  console.log("Error in connecting to MongoDB! :(");
  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
