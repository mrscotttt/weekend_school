import { Router } from 'express';
import studentRoutes from './studentRoutes';
import bookingRoutes from './bookingRoutes';

const router = Router();

router.use('/students', studentRoutes);
router.use('/bookings', bookingRoutes);

export default router;
