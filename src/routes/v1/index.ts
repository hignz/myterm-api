import express from 'express';
import courseRoute from './course.route.js';
import timetableChecklistRoute from './timetable.route.js';
import docsRoute from './docs.route.js';

const router = express.Router();

router.use('/courses', courseRoute);
router.use('/docs', docsRoute);
router.use('/timetables', timetableChecklistRoute);

export default router;
