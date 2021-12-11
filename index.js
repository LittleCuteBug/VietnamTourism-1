const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const router = require('./routes');
require('dotenv').config();
const db = require('./db/models');




var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  //await db.sequelize.sync({force: true});
  console.log(`Server is running on port ${PORT}.`);
});
