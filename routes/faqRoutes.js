import express from 'express';
import {
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQById,
  getAllFAQs
} from '../controller/faqControllers.js';

const router = express.Router();

// FAQ Management
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);
router.get('/faqs/:id', getFAQById);
router.get('/faqs', getAllFAQs);

export default router;
