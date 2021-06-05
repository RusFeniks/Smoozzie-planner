const Error = require('../errors');
const Moment = require('moment');

module.exports = {

    id: data => {
        const id = +data;
        if(!id) {
            throw new Error.BadRequest("Id is not set");
        }
        return id;
    },

    userId: data => {
        const userId = +data;
        if(!userId) {
            throw new Error.Unauthorized("Unauthorized");
        }
        return userId;
    },

    datetime: data => {
        const momentDateTime = Moment.utc(data);
        if(!momentDateTime.isValid()) {
            throw new Error.BadRequest("DateTime is invalid");
        }
        return momentDateTime;
    },

    title: data => {
        if(!data) {
            throw new Error.BadRequest("Tittle is not set");
        }
        return data;
    },

    message: data => {
        if(!data) {
            throw new Error.BadRequest("Message is not set");
        }
        return data;
    }

}