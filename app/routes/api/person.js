const router = require('express').Router();
const { person } = require('../../controllers');
const { verifyAuth } = require('../../controllers/auth.controller')

/**
 * @api {get} /person/:username GetPerson
 * @apiVersion 0.1.0
 * @apiName GetPerson
 * @apiGroup Person
 * @apiPermission vary
 * 
 * @apiDescription Get a Person object. 
 * For the user requesting anyone else:
 *      username, firstName, lastName
 * If the user is a friend, get an address too
 * If it's the user itself, get an e-mail too
 * 
 * @apiParam {String} username The username (unique)
 * 
 * @apiSuccess {Object} person person
 * @apiSuccess {String} person.username username
 * @apiSuccess {String} person.firstName firstName
 * @apiSuccess {String} person.lastName lastName
 * @apiSuccess {String} person.address address (if friends)
 * @apiSuccess {String} person.email email (if same user)
 * @apiSuccess {String} person.friends friends list (currently all users)
 * 
 * @apiError PersonNotFound Person Not Found   
 * @apiError AuthRequired Authentication header not found
 */
router.get('/:username', verifyAuth, person.getPerson)

/**
 * @api {patch} /person/:username UpdatePerson
 * @apiVersion 0.1.0
 * @apiName UpdatePerson
 * @apiGroup Person
 * @apiPermission SameUserOnly
 * 
 * @apiDescription Update a Person, 
 * send one or another Person object fields to update
 * @apiParam {String} username The username (unique)
 * @apiParam {String} firstName firstName, optional
 * @apiParam {String} lastName lastName, optional
 * @apiParam {String} address address, optional
 * 
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError PersonNotFound Person Not Found
 * @apiError NotAuthorized Not authorized to update
 * @apiError AuthRequired Authentication header not found
 */
router.patch('/:username', verifyAuth, person.updatePerson)

/**
 * @api {get} /person/:username/drives GetPersonDrives
 * @apiVersion 0.1.0
 * @apiName GetPersonDrives
 * @apiGroup Person
 * @apiPermission vary
 * 
 * @apiDescription Get a Drive array.
 * For the user requesting anyone else: None
 * If the user has mutual drives: Mutual drives
 * If it's the user itself: All drives (100 limit from top by time)
 * 
 * @apiParam {String} username The username (unique)
 * 
 * @apiSuccess {Object[]} drives Array of Drive objects
 * 
 * @apiError PersonNotFound Person Not Found
 * @apiError NotAuthorized Not authorized to get drives
 * @apiError AuthRequired Authentication header not found
 */
router.get('/:username/drives', verifyAuth, person.getPersonDrives)

/**
 * @api {get} /person/:query/search SearchPerson
 * @apiVersion 0.1.0
 * @apiName SearchPerson
 * @apiGroup Person
 * @apiPermission Everyone
 * 
 * @apiDescription Search Persons.
 * Search for a username starting with the "query" param
 * Ending with anything (wildcard). 
 * Getting back an array of top 30 results, 
 * sorted decending by top mutual friends.
 * 
 * @apiParam {String} query username query
 * 
 * @apiSuccess {Object[]} results array of limited Person object
 * @apiSuccess {String} results.username username
 * @apiSuccess {String} results.firstName First name
 * @apiSuccess {String} results.lastName Last name
 * @apiSuccess {String} results.address Address (Friends only, else None)
 * @apiSuccess {String} results.status friendship status 
 * 
 * @apiError AuthRequired Authentication header not found
 */
router.get('/:query/search', verifyAuth, person.searchPerson)

/**
 * @api {put} /person/:username/friend addFriend
 * @apiVersion 0.1.0
 * @apiName addFriend
 * @apiGroup Person
 * 
 * @apiDescription Add a friend.
 * 
 * @apiParam {String} username username to add as friend
 *
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError PersonNotFound Person Not Found
 * @apiError PersonAlreadyFriend Person is already a friend
 * @apiError NotAuthorized Not authorized to add friend
 * @apiError AuthRequired Authentication header not found
 */
router.put('/:username/friend', verifyAuth, person.addFriend)

/**
 * @api {get} /person/:username/friends getFriends
 * @apiVersion 0.1.0
 * @apiName getFriends
 * @apiGroup Person
 * 
 * @apiDescription Get a list of friends with statuses.
 * 
 * @apiParam {String} username username to get friends of
 *
 * @apiSuccess {Object[]} friends friends list (Persons with status)
 * @apiSuccess {String} friends.username username
 * @apiSuccess {String} friends.firstName firstName
 * @apiSuccess {String} friends.lastName lastName
 * @apiSuccess {String} friends.address address 
 * @apiSuccess {String} friends.status status: "Pending" or "Accepted"
 * 
 * @apiError PersonNotFound Person Not Found
 * @apiError NotAuthorized Not authorized to get friends list
 * @apiError AuthRequired Authentication header not found
 */
router.get('/:username/friends', verifyAuth, person.getFriends)

/**
 * @api {delete} /person/:username/friend deleteFriend
 * @apiVersion 0.1.0
 * @apiName deleteFriend
 * @apiGroup Person
 * 
 * @apiDescription Delete a friend.
 * 
 * @apiParam {String} username username to delete as friend
 *
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError PersonNotFound Person Not Found
 * @apiError PersonNotFriend Person is not a friend already
 * @apiError NotAuthorized Not authorized to add friend
 * @apiError AuthRequired Authentication header not found
 */
router.delete('/:username/friend', verifyAuth, person.deleteFriend)

module.exports = router;