import { Router } from 'express';
import { patchSkip } from '../controllers/skipController';

const router = Router();

router.patch('/', patchSkip);

export default router;
