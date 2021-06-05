const Validate = require('./ValidateTipsData');
const Error = require('../errors');

function getTipById(tipsRepo, userId) {
    return async (req, res) => {

        res.set('Content-Type', 'application/json');
        const defaultErrorCode = 500;

        try {

            const data = await tipsRepo.getTipById(
                Validate.id(req.params.id),
                Validate.userId(userId)
            );
            if(data.length == 0) { throw new Error.NotFound(); }
            res.send(JSON.stringify(data));

        } catch (error) {
            res.status(error.code || defaultErrorCode);
            res.send(JSON.stringify(error.message));
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

            const data = await tipsRepo.getTipsByDate(
                Validate.datetime(req.query.date).format('yyyy-MM-DD'),
                Validate.userId(userId)
            );
            res.send(JSON.stringify(data));

        } catch (error) {
            res.status(error.code || defaultErrorCode);
            res.send(JSON.stringify(error.message));
        }

        res.end();
        return;
    }
}


module.exports = { getTipById, getTipsByDate };