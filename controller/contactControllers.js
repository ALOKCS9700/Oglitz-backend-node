import contactModels from '../models/contact.models.js';

// Create a new contact message
export const createContactMessage = async (req, res) => {
  try {
    const newContactMessage = new contactModels(req.body);
    await newContactMessage.save();
    res.status(201).json(newContactMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all contact messages
export const getContactMessages = async (req, res) => {
  try {
    const contactMessages = await contactModels.find();
    res.status(200).json(contactMessages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a contact message by ID
export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const contactMessage = await contactModels.findById(id);
    if (!contactMessage) return res.status(404).json({ error: 'Contact message not found' });
    res.status(200).json(contactMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a contact message by ID
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContactMessage = await contactModels.findByIdAndDelete(id);
    if (!deletedContactMessage) return res.status(404).json({ error: 'Contact message not found' });
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
