class BadRequest extends Error {
    constructor(message) {
        super(message || "Bad Request");
        this.code = 400;
    }
}

class Unauthorized extends Error {
    constructor(message) {
        super(message || "Unauthorized");
        this.code = 401;
    }
}

class NotFound extends Error {
    constructor(message) {
        super(message || "Not Found");
        this.code = 404;
    }
}

module.exports = {
    NotFound,
    Unauthorized,
    BadRequest
}