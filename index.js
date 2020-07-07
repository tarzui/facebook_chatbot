const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Config = require("./config");
const Router = require("./v1.0");

const app = express();
const server = require("http").Server(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);

server.listen(Config.port, () => console.log(`Hello world app listening on port ${Config.port}!`));
