const router = require('express').Router();
const { drive } = require('../../controllers');
const { verifyAuth } = require('../../controllers/auth.controller')

/**
 * @api {get} /drive/:id GetDrive
 * @apiName GetDrive
 * @apiGroup Drive
 * @apiVersion 0.1.0
 * @apiPermission vary
 * 
 * @apiDescription Get a Drive object. 
 * If user is not a participant, None
 * 
 * @apiParam {String} id drive id
 *
 * @apiSuccess {String} id drive id
 * @apiSuccess {String} dest drive destination
 * @apiSuccess {Date} date drive date
 * @apiSuccess {String} driver drive driver username
 * @apiSuccess {String[]} participants drive participants usernames array
 * 
 * @apiError DriveNotFound Drive Not Found
 * @apiError NotAuthorized Not authorized to get drive
 * @apiError AuthRequired Authentication header not found
 */
router.get('/:id', verifyAuth, drive.getDrive)

/**
 * @api {put} /drive/ AddDrive
 * @apiVersion 0.1.0
 * @apiName AddDrive
 * @apiGroup Drive
 * @apiPermission vary
 * 
 * @apiDescription Add a Drive.
 * Adding user must be a participant of the drive.
 * 
 * @apiParam {String} dest drive destination
 * @apiParam {Date} date drive date
 * @apiParam {String} driver drive driver username
 * @apiParam {String[]} participants drive participants usernames array
 * 
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError NotAuthorized Not authorized to add drive, not a participant
 * @apiError AuthRequired Authentication header not found
 */
router.put('/', verifyAuth, drive.addDrive)

/**
 * @api {patch} /drive/:id UpdateDrive
 * @apiVersion 0.1.0
 * @apiName UpdateDrive
 * @apiGroup Drive
 * @apiPermission participants of the drive
 * 
 * @apiDescription Update a Drive.
 * Editing user must be a participant of the drive.
 * 
 * @apiParam {String} id drive id (URL param)
 * @apiParam {String} dest drive destination
 * @apiParam {Date} date drive date
 * @apiParam {String} driver drive driver username
 * @apiParam {String[]} participants drive participants usernames array
 * 
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError DriveNotFound Drive Not Found
 * @apiError NotAuthorized Not authorized to update drive, not a participant
 * @apiError AuthRequired Authentication header not found
 */
router.patch('/:id', verifyAuth, drive.updateDrive)

/**
 * @api {delete} /drive/:id DeleteDrive
 * @apiVersion 0.1.0
 * @apiName DeleteDrive
 * @apiGroup Drive
 * @apiPermission participants of the drive
 * 
 * @apiDescription Delete a Drive.
 * Deleting user must be a participant of the drive.
 * 
 * @apiParam {String} id drive id
 * 
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError DriveNotFound Drive Not Found
 * @apiError NotAuthorized Not authorized to update drive, not a participant
 * @apiError AuthRequired Authentication header not found
 */
router.delete('/:id', verifyAuth, drive.deleteDrive)

module.exports = router;