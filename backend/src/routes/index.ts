import { Router } from 'express';
import studentRoutes from './studentRoutes';
import bookingRoutes from './bookingRoutes';
import attendRoutes from './attendRoutes';

const router = Router();

router.use('/students', studentRoutes);
router.use('/bookings', bookingRoutes);
router.use('/attend', attendRoutes);

export default router;
