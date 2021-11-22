import express from "express";
import { UseRouter } from "../../pkg/core/router/useRouter";
import { BookController } from "../../pkg/core/api/v1/controller/bookController";
import { MemberController } from "../../pkg/core/api/v1/controller/memberController";
import { CartController } from "../../pkg/core/api/v1/controller/cartController";
import { OrderController } from "../../pkg/core/api/v1/controller/orderController";
import { CartDetailController } from "../../pkg/core/api/v1/controller/cartDetailController";

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
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = new UseRouter(app, apiVersion);
const BookCtrl = new BookController();
const MemberCtrl = new MemberController();
const CartCtrl = new CartController();
const OrderCtrl = new OrderController();
const CartDetailCtrl = new CartDetailController();

const cors = require("cors");
app.use(cors());

if (apiVersion == "v1") {
  server.addRule(
    apiVersion + "/books",
    "GET",
    "get Book List",
    "Book",
    BookCtrl.getBooks()
  );

  server.addRule(
    apiVersion + "/books/:BookId",
    "GET",
    "get Book at number",
    "Book",
    BookCtrl.getBook()
  );

  server.addRule(
    apiVersion + "/books",
    "POST",
    "create Book",
    "Book",
    BookCtrl.createBook()
  );

  server.addRule(
    apiVersion + "/books/:BookId",
    "POST",
    "Update Book",
    "Book",
    BookCtrl.updateBook()
  );

  server.addRule(
    apiVersion + "/books/:BookId",
    "DELETE",
    "Delete Book",
    "Book",
    BookCtrl.deleteBook()
  );

  server.addRule(
    apiVersion + "/member/list",
    "GET",
    "member list",
    "Member list",
    MemberCtrl.list()
  );

  server.addRule(
    apiVersion + "/member/join",
    "POST",
    "member join",
    "Member Join",
    MemberCtrl.join()
  );

  server.addRule(
    apiVersion + "/member/login",
    "POST",
    "login member",
    "Member",
    MemberCtrl.login()
  );

  server.addRule(
    apiVersion + "/cart/:MemberId",
    "GET",
    "get cart",
    "Cart",
    CartCtrl.getAllCart()
  );

  server.addRule(
    apiVersion + "/cart",
    "POST",
    "create cart",
    "Cart",
    CartCtrl.createNewCart()
  );

  server.addRule(
    apiVersion + "/cart/:CartId",
    "DELETE",
    "delete cart",
    "Cart",
    CartCtrl.deleteCart()
  );

  server.addRule(
    apiVersion + "/order",
    "POST",
    "Create new Order",
    "Order",
    OrderCtrl.createNewOrder()
  );

  server.addRule(
    apiVersion + "/order",
    "GET",
    "Get Order list",
    "Order",
    OrderCtrl.getAllOrder()
  );

  server.addRule(
    apiVersion + "/order/:OrderId",
    "GET",
    "get Order detail",
    "Order",
    OrderCtrl.getOrderDetail()
  );

  server.addRule(
    apiVersion + "/cartDetail/update",
    "POST",
    "Update order list",
    "Order",
    CartDetailCtrl.updateCartDetail()
  );

  server.addRule(
    apiVersion + "/cartDetail",
    "POST",
    "insert new Cart_Book",
    "Cart_Book",
    CartDetailCtrl.createNewCartDetail()
  );

  server.addRule(
    apiVersion + "/cartDetail/:CartNo/:BookNo",
    "DELETE",
    "Delete new Cart_Book",
    "Cart_Book",
    CartDetailCtrl.deleteCartDetail()
  );

  server.addRule(
    apiVersion + "/cartDetail/:CartNo",
    "GET",
    "GET Cart_Book list",
    "Cart_Book",
    CartDetailCtrl.getAllCartDetailFromCartNo()
  );

  // server.addRule()
}

server.listen(port);
