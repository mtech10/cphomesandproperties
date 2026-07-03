import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const realtorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    // This becomes the endpoint of the realtor's personal referral link,
    // e.g. https://yourdomain.com/register/USERNAME
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    // If this realtor signed up through someone else's referral link,
    // this points at that person's Realtor document.
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Realtor",
      default: null,
    },
  },
  { timestamps: true },
);

realtorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

realtorSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

realtorSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("Realtor", realtorSchema);
