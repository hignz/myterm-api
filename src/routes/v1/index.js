const express = require('express');
const courseRoute = require('./course.route');
const timetableChecklistRoute = require('./timetable.route');
const docsRoute = require('./docs.route');

const router = express.Router();

router.use('/courses', courseRoute);
router.use('/docs', docsRoute);
router.use('/timetables', timetableChecklistRoute);

module.exports = router;
