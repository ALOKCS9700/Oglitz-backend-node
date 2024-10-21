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
    const updatedFAQ = await faqModels.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedFAQ) return res.status(404).json({ error: "FAQ not found" });
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
    if (!deletedFAQ) return res.status(404).json({ error: "FAQ not found" });
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all FAQs with pagination
export const getAllFAQs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    // Fetch FAQs with pagination
    const faqs = await faqModels.find().skip(skip).limit(limit);

    // Count total number of FAQs
    const totalCount = await faqModels.countDocuments();

    // Format response
    const response = {
      faqData: faqs.map((faq) => ({
        id: faq._id, // Use MongoDB ID as the 'id'
        question: faq.question,
        answer: faq.answer,
        dateCreated: faq.createdAt, // Use the 'createdAt' timestamp
      })),
      Page: page,
      Count: totalCount,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get an FAQ by ID
export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await faqModels.findById(id);

    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    // Format the response according to your requirements
    const response = {
      id: faq._id,
      question: faq.question,
      answer: faq.answer,
      dateCreated: faq.createdAt, // Use the createdAt field provided by timestamps
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
