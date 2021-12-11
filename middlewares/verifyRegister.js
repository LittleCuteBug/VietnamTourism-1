const db = require('../db/models');
const User = db.User;

checkDuplicateUsername = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    })
    if (user) {
        res.status(400).send({
            code: 1,
            message: "Error: this username is exist"
        });
        return;
    }
    next();
}
const verifyRegister = {
    checkDuplicateUsername: checkDuplicateUsername
}

module.exports = verifyRegister;