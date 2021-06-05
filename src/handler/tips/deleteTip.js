function deleteTip(tipsRepo, userId) {
    return async (req, res) => {

        res.set('Content-Type', 'application/json');
        res.send("delete tip");
        res.end();

        try {
            
        } catch (error) {

        }

        return
    }
}

module.exports = deleteTip;