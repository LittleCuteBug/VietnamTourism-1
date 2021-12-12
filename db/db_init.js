const db = require('./models');
const sequelize = db.sequelize;


const addFullTextIndex = async () => {
    try {
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(description);");
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(name);");
        await sequelize.query("ALTER TABLE Locations ADD FULLTEXT(address);");
        console.log("========================");
        console.log("ADD FULL TEXT INDEX SUCCESS");
        console.log("========================");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addFullTextIndex: addFullTextIndex
}


