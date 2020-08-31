const express = require('express');
const courseController = require('../../controllers/course.controller');
const courseValidation = require('../../validations/course.validation');
const validate = require('../../middleware/validate');

const router = express.Router();

router.get(
  '/',
  validate(courseValidation.getCourses, 'query'),
  courseController.getCoursesByCollege
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course retrieval
 */

/**
 * @swagger
 * path:
 *  /courses?college={id}:
 *    get:
 *      summary: Get all courses from specified college
 *      description: Get courses by college ID.
 *      tags: [Courses]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: College id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
