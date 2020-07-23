/* eslint-disable consistent-return */
const express = require('express');
const timetableController = require('../../controllers/timetable.controller');

const router = express.Router();

router.get('/:code?:college?:sem?', timetableController.getTimetable);

module.exports = router;
