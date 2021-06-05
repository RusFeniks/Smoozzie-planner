const moment = require('moment');
const Error = require('../../errors');

function getTipById(tipsRepo, userId) {
    return async (req, res) => {

        res.set('Content-Type', 'application/json');
        const defaultErrorCode = 500;

        try {
            if(!userId) { throw new Error.Unauthorized(); }

            const tipId = +req.params.id || null;
            if(!tipId) { throw new Error.NotFound("Tip's id is not set!"); }

            const data = await tipsRepo.getTipById(tipId, userId);
            if(data.length == 0) { throw new Error.NotFound(); }
            res.send(JSON.stringify(data));

        } catch (error) {
            res.status(error.code || defaultErrorCode);
            res.send(error.message);
        }

        res.end();
        return;
    }
}


function getTipsByDate(tipsRepo, userId) {
    return async (req, res) => {
        
        res.set('Content-Type', 'application/json');
        const defaultErrorCode = 500;

        try {
            if(!userId) { throw new Error.Unauthorized(); }

            const date = moment.utc(req.query.date);
            if(!date.isValid()) {
                throw new Error.BadRequest("Date is invalid");
            }

            const data = await tipsRepo.getTipsByDate(
                date.format('yyyy-MM-DD'),
                userId
            );
            res.send(JSON.stringify(data));

        } catch (error) {
            res.status(error.code || defaultErrorCode);
            res.send(error.message);
        }

        res.end();
        return;
    }
}


module.exports = { getTipById, getTipsByDate };