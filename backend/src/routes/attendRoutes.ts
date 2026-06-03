import { Router } from 'express';
import { patchAttend } from '../controllers/attendController';

const router = Router();

router.patch('/', patchAttend);

export default router;
