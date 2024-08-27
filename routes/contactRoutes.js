import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  deleteContactMessage
} from '../controller/contactControllers.js';

const router = express.Router();

// Contact Us Management
router.post('/contact', createContactMessage);
router.get('/contact', getContactMessages);
router.get('/contact/:id', getContactMessageById);
router.delete('/contact/:id', deleteContactMessage);

export default router;
