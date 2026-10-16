import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    url: { type: String },
    location: { type: String, required: true },
    date: { type: String, required: true },
    highlights: [String],
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Experience", experienceSchema);
