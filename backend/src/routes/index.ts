import { Router } from 'express';
import studentRoutes from './studentRoutes';
import bookingRoutes from './bookingRoutes';
import attendRoutes from './attendRoutes';
import absentRoutes from './absentRoutes';

const router = Router();

router.use('/students', studentRoutes);
router.use('/bookings', bookingRoutes);
router.use('/attend', attendRoutes);
router.use('/absent', absentRoutes);

export default router;
