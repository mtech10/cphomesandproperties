import Realtor from "../models/Realtor.js";
import mongoose from "mongoose";

// @desc    Register a new realtor (optionally through someone else's referral link)
// @route   POST /api/realtors/register
// @access  Public
const registerRealtor = async (req, res) => {
  try {
    const { fullName, email, phone, username, password, referralUsername } =
      req.body;

    if (!fullName || !email || !phone || !username || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Make sure the email and username are not already taken
    const existing = await Realtor.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        return res
          .status(409)
          .json({ message: "An account with this email already exists." });
      }
      return res
        .status(409)
        .json({
          message: "This username is already taken. Please choose another one.",
        });
    }

    // Resolve who referred this realtor, if anyone
    let referredBy = null;
    let referrer = null;
    if (referralUsername) {
      referrer = await Realtor.findOne({
        username: referralUsername.trim().toLowerCase(),
      });
      if (referrer) {
        referredBy = referrer._id;
      }
      // If the referral username doesn't match anyone, we simply register
      // the realtor as a direct sign-up instead of blocking registration.
    }

    const realtor = await Realtor.create({
      fullName,
      email: cleanEmail,
      phone,
      username: cleanUsername,
      password,
      referredBy,
    });

    return res.status(201).json({
      message: "Registration successful.",
      realtor: {
        id: realtor._id,
        fullName: realtor.fullName,
        email: realtor.email,
        username: realtor.username,
        referredBy: referrer
          ? { username: referrer.username, fullName: referrer.fullName }
          : null,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(409)
        .json({ message: `That ${field} is already in use.` });
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(" ");
      return res.status(400).json({ message });
    }
    console.error(err);
    return res
      .status(500)
      .json({
        message: "Something went wrong while registering. Please try again.",
      });
  }
};

// @desc    Look up a realtor by username, used to validate a referral link
//          and greet the new sign-up with who invited them.
// @route   GET /api/realtors/lookup/:username
// @access  Public
const lookupByUsername = async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const realtor = await Realtor.findOne({ username }).select(
      "fullName username",
    );

    if (!realtor) {
      return res
        .status(404)
        .json({ message: "This referral link is not valid or has expired." });
    }

    return res.json({ fullName: realtor.fullName, username: realtor.username });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong looking up that link." });
  }
};

// @desc    Get every realtor a given user has personally referred
// @route   GET /api/realtors/:username/referrals
// @access  Public
const getReferralsForUsername = async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const owner = await Realtor.findOne({ username });

    if (!owner) {
      return res
        .status(404)
        .json({ message: "No realtor found with that username." });
    }

    const referrals = await Realtor.find({ referredBy: owner._id })
      .select("fullName username email phone createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      owner: { fullName: owner.fullName, username: owner.username },
      count: referrals.length,
      referrals,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong fetching referrals." });
  }
};

// @desc    Get every realtor in the system, with who referred them and
//          how many people they have personally referred. Used by the
//          internal dashboard.
// @route   GET /api/realtors
// @access  Private (requires x-admin-key header)
const getAllRealtors = async (req, res) => {
  try {
    const realtors = await Realtor.find()
      .select("fullName email phone username referredBy createdAt")
      .populate("referredBy", "fullName username")
      .sort({ createdAt: -1 });

    const counts = await Realtor.aggregate([
      { $match: { referredBy: { $ne: null } } },
      { $group: { _id: "$referredBy", total: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce((acc, c) => {
      acc[c._id.toString()] = c.total;
      return acc;
    }, {});

    const result = realtors.map((r) => ({
      id: r._id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      username: r.username,
      referredBy: r.referredBy
        ? { fullName: r.referredBy.fullName, username: r.referredBy.username }
        : null,
      referralCount: countMap[r._id.toString()] || 0,
      joinedAt: r.createdAt,
    }));

    return res.json({ total: result.length, realtors: result });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong fetching realtors." });
  }
};

export {
  registerRealtor,
  lookupByUsername,
  getReferralsForUsername,
  getAllRealtors,
};
