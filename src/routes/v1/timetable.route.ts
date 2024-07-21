import express from 'express';
import * as timetableController from '../../controllers/timetable.controller.js';
import * as timetableValidation from '../../validations/timetable.validation.js';
import validate from '../../middleware/validate.js';

const router = express.Router();

router.get(
  '/:code?:college?:sem?',
  validate(timetableValidation.getTimetable, 'query'),
  timetableController.getTimetable
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Timetables
 *   description: Timetable retrieval
 */

/**
 * @swagger
 * path:
 *  /timetables?code={id}&college={id}&sem={int}:
 *    get:
 *      summary: Gets timetable for specified course
 *      description: Get timetable by course code and college id, semester is optional.
 *      tags: [Timetables]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: code
 *          required: true
 *          schema:
 *            type: string
 *          description: Course code
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: College ID
 *        - in: path
 *          name: semester
 *          required: false
 *          schema:
 *            type: string
 *          description: Semester
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
