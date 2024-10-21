import express from "express";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getAllSocialLinks,
  getSocialLinkById,
  getTeamMemberById,
} from "../controller/nautikaTeamSocialController.js"; // Adjust path as necessary

const router = express.Router();

// Team Routes
router.post("/team", createTeamMember);
router.put("/team/:id", updateTeamMember);
router.delete("/team/:id", deleteTeamMember);
router.get("/team", getAllTeamMembers);
router.get("/team/:id", getTeamMemberById);

// Social Routes
router.post("/social", createSocialLink);
router.put("/social/:id", updateSocialLink);
router.delete("/social/:id", deleteSocialLink);
router.get("/social", getAllSocialLinks);
router.get("/social/:id", getSocialLinkById);

export default router;
