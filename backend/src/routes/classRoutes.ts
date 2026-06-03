import { Router } from 'express';
import { getAllClasses } from '../controllers/classController';

const router = Router();

router.get('/all', getAllClasses);

export default router;
