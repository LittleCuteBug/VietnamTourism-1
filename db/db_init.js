const db = require('./models');
const sequelize = db.sequelize;
const bcrypt = require('bcryptjs');
const User = db.User;

const addFullTextIndex = async () => {
    try {
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(description) WITH PARSER ngram;");
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(description) WITH PARSER ngram;");
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(name) WITH PARSER ngram;");
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(address) WITH PARSER ngram;");
        await sequelize.query("ALTER TABLE Tours ADD FULLTEXT(name) WITH PARSER ngram;");
        console.log("========================");
        console.log("ADD FULL TEXT INDEX SUCCESS");
        console.log("========================");
    } catch (error) {
        console.log(error);
    }
}
const createAdminAccount = async () => {
    const admin = {
        username: 'admin',
        password: bcrypt.hashSync('admin', 8),
        firstname: 'admin',
        lastname: 'admin',
        phonenumber: '0999999999',
        role: 'admin'
    }
    try {
        await User.create(admin);

    } catch (error) {
        console.log(error);
    }
}
const init_db = async () => {
    await db.sequelize.sync({force: true});
    await addFullTextIndex();
    await createAdminAccount();
}

module.exports = {
    init_db: init_db
}


