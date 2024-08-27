import express from 'express';
import {
  createPolicy,
  getPolicy,
  updatePolicy,
  deletePolicy
} from '../controller/policyControllers.js';

const router = express.Router();

// Policies Management
router.post('/policy', createPolicy);
router.get('/policy/:type', getPolicy);
router.put('/policy/:type', updatePolicy);
router.delete('/policy/:type', deletePolicy);

export default router;
