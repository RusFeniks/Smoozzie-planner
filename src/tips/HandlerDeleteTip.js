const Validate = require('./ValidateTipsData');

function deleteTip(tipsRepo, userId) {
    return async (req, res) => {

        res.set('Content-Type', 'application/json');
        const defaultErrorCode = 500;

        try {

            const data = await tipsRepo.deleteTip(
                Validate.id(req.params.id),
                Validate.userId(userId)
            );
            res.send(JSON.stringify(data));
            
        } catch (error) {
            res.status(error.code || defaultErrorCode);
            res.send(error.message);
        }

        res.end();
        return
    }
}

module.exports = deleteTip;