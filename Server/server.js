"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var morgan_1 = require("morgan");
dotenv_1["default"].config();
var app = express_1["default"]();
var PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1["default"]("dev"));
}
app.use(body_parser_1["default"].json());
app.listen(PORT, function () {
    return console.log("Server is running at http://127.0.0.1:" + PORT + "/");
});
