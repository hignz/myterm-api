const express = require('express');
const courseController = require('../../controllers/course.controller');

const router = express.Router();

router.get('/', courseController.getCoursesByCollege);

module.exports = router;
