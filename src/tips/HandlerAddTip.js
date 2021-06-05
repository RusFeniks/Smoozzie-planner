const Validate = require('./ValidateTipsData');

function addTip(tipsRepo, userId) {
    return async (req, res) => {

        res.set('Content-Type', 'application/json');
        const defaultErrorCode = 500;

        try {
            
            const tipData = {
                user_id: Validate.userId(userId),
                date: Validate.datetime(req.body.datetime).format('yyyy-MM-DD'),
                time: Validate.datetime(req.body.datetime).format('hh:mm:ss'),
                title: Validate.title(req.body.title),
                message: Validate.title(req.body.message)
            }
            
            const data = await tipsRepo.addTip(tipData);
            res.send(JSON.stringify(data));
            
        } catch (error) {
            res.status(error.code || defaultErrorCode);
            res.send(JSON.stringify(error.message));
        }

        res.end();
        return
    }
}

module.exports = addTip;