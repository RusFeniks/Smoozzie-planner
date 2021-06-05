function addTip(tipsRepo, userId) {
    return async (req, res) => {

        res.set('Content-Type', 'application/json');
        res.send("add tip");
        res.end();

        try {
            
        } catch (error) {

        }

        return
    }
}

module.exports = addTip;