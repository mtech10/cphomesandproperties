import express from "express";
const router = express.Router();
import {
  registerRealtor,
  lookupByUsername,
  getReferralsForUsername,
  getAllRealtors,
} from "../controllers/realtorController.js";
import adminAuth from "../middleware/adminAuth.js";

// Public: create a new realtor account (with optional referral)
router.post("/register", registerRealtor);

// Public: check whether a referral username/link is valid and get the
// referrer's display name to show a "Invited by ..." message
router.get("/lookup/:username", lookupByUsername);

// Public: see who a specific realtor has referred
router.get("/:username/referrals", getReferralsForUsername);

// Private: full list of realtors for the internal dashboard
router.get("/", adminAuth, getAllRealtors);

export default router;
