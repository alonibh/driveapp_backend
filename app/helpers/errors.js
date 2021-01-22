class APIError extends Error {
    /**
     * APIError object, thrown by services and controllers
     * Global error handler at the Router should catch those.
     * @param {String} message Message, if public, as mentioned in API documentation.
     * @param {*} params Additional parameters, i.e. list of not found persons
     * @param {Boolean} isPublic handler should avoid posting message to user if not public
     */
    constructor(message, params = null, isPublic = false) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.params = params;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

APIErrorTypes = {
    PersonNotFound:     "PersonNotFound",
    DriveNotFound:      "DriveNotFound",
    NullParameters:     "NullParameters",
    BadParameters:      "BadParameters",
    NoAuthKey:          "NoAuthKey",
    NotAuthorized:      "NotAuthorized",
    NotImplemented:     "NotImplemented",
    UsernameExists:     "UsernameExists",
    InvalidCreds:       "InvalidCreds",
    PersonAlreadyFriend:"PersonAlreadyFriend",
    PersonNotFriend:    "PersonNotFriend"
}

module.exports = {
    APIError,
    APIErrorTypes
}