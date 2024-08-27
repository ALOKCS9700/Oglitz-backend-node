import faqModels from "../models/faq.models.js";

// Create a new FAQ
export const createFAQ = async (req, res) => {
  try {
    const newFAQ = new faqModels(req.body);
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an FAQ by ID
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFAQ = await faqModels.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFAQ) return res.status(404).json({ error: 'FAQ not found' });
    res.status(200).json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an FAQ by ID
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFAQ = await faqModels.findByIdAndDelete(id);
    if (!deletedFAQ) return res.status(404).json({ error: 'FAQ not found' });
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get an FAQ by ID
export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await faqModels.findById(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all FAQs
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await faqModels.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
