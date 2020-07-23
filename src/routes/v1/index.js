const express = require('express');
const courseRoute = require('./course.route');
const roomRoute = require('./room.route');
const timetableChecklistRoute = require('./timetable.route');

const router = express.Router();

router.use('/courses', courseRoute);
router.use('/rooms', roomRoute);
router.use('/timetables', timetableChecklistRoute);

module.exports = router;
