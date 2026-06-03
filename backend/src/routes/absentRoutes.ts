import { Router } from 'express';
import { patchAbsent } from '../controllers/absentController';

const router = Router();

router.patch('/', patchAbsent);

export default router;
