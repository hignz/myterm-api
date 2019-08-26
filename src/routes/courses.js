const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

router.get('/courses?:college', async (req, res, next) => {
  try {
    const courses = await Course.find({ college: req.query.college });

    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      messaage: 'An error occured',
    });
  }
});

module.exports = router;
