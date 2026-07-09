import mongoose from "mongoose";

// A tiny collection that holds one running counter per "name" (_id).
// findByIdAndUpdate with $inc is atomic, so two simultaneous registrations
// can never be handed the same number.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export default mongoose.model("Counter", counterSchema);
