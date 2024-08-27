import express from 'express';
import {
  subscribeNewsletter,
  getAllSubscribers,
  unsubscribeNewsletter
} from '../controller/newsletterControllers.js';

const router = express.Router();

// Newsletter management
router.post('/subscribe', subscribeNewsletter);
router.get('/subscribers', getAllSubscribers);
router.delete('/unsubscribe/:email', unsubscribeNewsletter);

export default router;
