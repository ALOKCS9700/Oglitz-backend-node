import socialNautikaModels from "../models/socialNautika.models.js";
import teamNautikaModels from "../models/teamNautika.models.js";

// Create a new Team member
export const createTeamMember = async (req, res) => {
  try {
    const newTeamMember = new teamNautikaModels(req.body);
    await newTeamMember.save();
    res.status(201).json(newTeamMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Team member by ID
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTeamMember = await teamNautikaModels.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTeamMember)
      return res.status(404).json({ error: "Team member not found" });
    res.status(200).json(updatedTeamMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Team member by ID
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeamMember = await teamNautikaModels.findByIdAndDelete(id);
    if (!deletedTeamMember)
      return res.status(404).json({ error: "Team member not found" });
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await teamNautikaModels.find().sort({ createdAt: -1 });
    res.status(200).json({ teamData: teamMembers, count: teamMembers.length });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a Team Member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await teamNautikaModels.findById(id);

    if (!teamMember) return res.status(404).json({ error: 'Team member not found' });

    // Format the response according to your requirements
    const response = {
      id: teamMember._id,
      name: teamMember.name,
      designation: teamMember.designation,
      image: teamMember.image,
      dateCreated: teamMember.createdAt, // Use the createdAt field provided by timestamps
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Create a new Social link
export const createSocialLink = async (req, res) => {
  try {
    const newSocialLink = new socialNautikaModels(req.body);
    await newSocialLink.save();
    res.status(201).json(newSocialLink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Social link by ID
export const updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSocialLink = await socialNautikaModels.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedSocialLink)
      return res.status(404).json({ error: "Social link not found" });
    res.status(200).json(updatedSocialLink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Social link by ID
export const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSocialLink = await socialNautikaModels.findByIdAndDelete(id);
    if (!deletedSocialLink)
      return res.status(404).json({ error: "Social link not found" });
    res.status(200).json({ message: "Social link deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Social links
export const getAllSocialLinks = async (req, res) => {
  try {
    const socialLinks = await socialNautikaModels
      .find()
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ socialData: socialLinks, count: socialLinks.length });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a Social Link by ID
export const getSocialLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const socialLink = await socialNautikaModels.findById(id);

    if (!socialLink) return res.status(404).json({ error: 'Social link not found' });

    // Format the response according to your requirements
    const response = {
      id: socialLink._id,
      name: socialLink.name,
      url: socialLink.url,
      image: socialLink.image,
      dateCreated: socialLink.createdAt, // Use the createdAt field provided by timestamps
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
