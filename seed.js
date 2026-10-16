import "dotenv/config";
import mongoose from "mongoose";
import Project from "./models/Project.js";
import Experience from "./models/Experience.js";
import { projects, experiences } from "./seed-data.js";

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to the databse in MongoDB!!");

  await Project.deleteMany({});
  await Experience.deleteMany({});

  const insertedProjects = await Project.insertMany(projects);
  const insertExperiences = await Experience.insertMany(experiences);

  console.log(`Inserted ${insertedProjects.length} into the database`);
  console.log(`Inserted ${insertExperiences.length} into the database`);
} catch (err) {
  console.error("Seed Failed", err.message);
} finally {
  await mongoose.disconnect();
  console.log("Connection has been disconnected");
}
