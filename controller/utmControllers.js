import utmModels from '../models/utm.models.js';

// Create a new UTM source
export const createUtmSource = async (req, res) => {
  try {
    const { source, medium, campaign, term, content } = req.body;
    const newUtmSource = new utmModels({ source, medium, campaign, term, content });
    await newUtmSource.save();
    res.status(201).json(newUtmSource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a UTM source by ID
export const getUtmSource = async (req, res) => {
  try {
    const { id } = req.params;
    const utmSource = await utmModels.findById(id);
    if (!utmSource) return res.status(404).json({ error: 'UTM source not found' });
    res.status(200).json(utmSource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all UTM sources
export const getAllUtmSources = async (req, res) => {
  try {
    const utmSources = await utmModels.find();
    res.status(200).json(utmSources);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a UTM source by ID
export const updateUtmSource = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, medium, campaign, term, content } = req.body;
    const updatedUtmSource = await utmModels.findByIdAndUpdate(
      id,
      { source, medium, campaign, term, content },
      { new: true }
    );
    if (!updatedUtmSource) return res.status(404).json({ error: 'UTM source not found' });
    res.status(200).json(updatedUtmSource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a UTM source by ID
export const deleteUtmSource = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUtmSource = await utmModels.findByIdAndDelete(id);
    if (!deletedUtmSource) return res.status(404).json({ error: 'UTM source not found' });
    res.status(200).json({ message: 'UTM source deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
