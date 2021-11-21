"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const useRouter_1 = require("../../pkg/core/router/useRouter");
const bookController_1 = require("../../pkg/core/api/v1/controller/bookController");
const memberController_1 = require("../../pkg/core/api/v1/controller/memberController");
const cartController_1 = require("../../pkg/core/api/v1/controller/cartController");
const orderController_1 = require("../../pkg/core/api/v1/controller/orderController");
// import * as swaggerUi from "swagger-ui-express";
// import * as swaggerJsDoc from "swagger-jsdoc";
// const options = {
//   swaggerDefinition: {
//     info: {
//       title: "BookShop api",
//       version: "0.0.1",
//       description: "Hello!",
//     },
//     host: "localhost:4000",
//     basePath: "/",
//   },
//   apis: ["../../pkg/core/api/v1/controller/*.ts"],
// };
// const specs = swaggerJsDoc.default(options);
let apiVersion = process.env.VERSION;
if (apiVersion == undefined) {
    console.log("Can't get env from project!!, start at v1 version");
    apiVersion = "v1";
}
const port = 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const server = new useRouter_1.UseRouter(app, apiVersion);
const BookCtrl = new bookController_1.BookController();
const MemberCtrl = new memberController_1.MemberController();
const CartCtrl = new cartController_1.CartController();
const OrderCtrl = new orderController_1.OrderController();
const cors = require("cors");
app.use(cors());
if (apiVersion == "v1") {
    server.addRule(apiVersion + "/books", "GET", "get Book List", "Book", BookCtrl.getBooks());
    server.addRule(apiVersion + "/books/:BookId", "GET", "get Book at number", "Book", BookCtrl.getBook());
    server.addRule(apiVersion + "/books", "POST", "create Book", "Book", BookCtrl.createBook());
    server.addRule(apiVersion + "/books/:BookId", "POST", "Update Book", "Book", BookCtrl.updateBook());
    server.addRule(apiVersion + "/books/:BookId", "DELETE", "Delete Book", "Book", BookCtrl.deleteBook());
    server.addRule(apiVersion + "/member/list", "GET", "member list", "Member list", MemberCtrl.list());
    server.addRule(apiVersion + "/member/join", "POST", "member join", "Member Join", MemberCtrl.join());
    server.addRule(apiVersion + "/member/login", "POST", "login member", "Member", MemberCtrl.login());
    server.addRule(apiVersion + "/cart/:MemberId", "GET", "get cart", "Cart", CartCtrl.getAllCart);
    server.addRule(apiVersion + "/cart", "POST", "create cart", "Cart", CartCtrl.createNewCart());
    server.addRule(apiVersion + "/cart/:CartId", "DELETE", "delete cart", "Cart", CartCtrl.deleteCart());
    server.addRule(apiVersion + "/order", "POST", "insert Order", "Order", OrderCtrl.createNewOrder());
    server.addRule(apiVersion + "/order", "GET", "insert Order", "Order", OrderCtrl.getAllOrder());
    server.addRule(apiVersion + "/order/:OrderId", "GET", "insert Order", "Order", OrderCtrl.getOrderDetail());
}
server.listen(port);
