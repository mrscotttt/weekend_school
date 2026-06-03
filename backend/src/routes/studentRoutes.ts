import { Router } from 'express';
import { getStudents, getCredits } from '../controllers/studentController';

const router = Router();

router.get('/', getStudents);
router.get('/credits', getCredits);

export default router;
