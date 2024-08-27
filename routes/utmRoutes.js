import express from 'express';
import {
  createUtmSource,
  getUtmSource,
  updateUtmSource,
  deleteUtmSource,
  getAllUtmSources
} from '../controller/utmControllers.js';

const router = express.Router();

// UTM Source Management
router.post('/utm', createUtmSource);
router.get('/utm/:id', getUtmSource);
router.get('/utm', getAllUtmSources);
router.put('/utm/:id', updateUtmSource);
router.delete('/utm/:id', deleteUtmSource);

export default router;
