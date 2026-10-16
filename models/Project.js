import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [String],
    repo: { type: String },
    status: { type: String, enum: ["done", "live", "wip"], required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
