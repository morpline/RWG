const myController = require("../controllers");
const routes = require("express").Router();

routes.get("/", myController.awe);

module.exports = routes;