import mongoose from "mongoose";
import Counter from "./Counter.js";

const realtorSchema = new mongoose.Schema(
  {
    // Sequential, human-readable partner ID: CPHP-00001, CPHP-00002 ...
    // Generated automatically in the pre-save hook below, never set manually.
    realtorId: {
      type: String,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9._-]{3,30}$/,
        "Username can only contain letters, numbers, dots, dashes and underscores (3-30 characters)",
      ],
    },
    mobileNumber: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "Nigeria" },
    state: { type: String, required: true, trim: true },
    accountName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Realtor",
      default: null,
    },
  },
  { timestamps: true },
);

// Runs once, automatically, the first time a new realtor document is saved.
// Atomically increments the shared counter so no two realtors can ever be
// handed the same ID, even if two people register at the exact same moment.
realtorSchema.pre("save", async function (next) {
  if (!this.isNew || this.realtorId) return next();

  try {
    const counter = await Counter.findByIdAndUpdate(
      "realtorId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    if (counter.seq > 10000) {
      return next(new Error("Registration limit of 10,000 partners reached."));
    }

    this.realtorId = `CPHP-${String(counter.seq).padStart(5, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Realtor", realtorSchema);
