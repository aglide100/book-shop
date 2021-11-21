"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const baseController_1 = require("../../../controller/baseController");
const uuid = __importStar(require("uuid"));
const cartDao_1 = require("../dao/cartDao");
const orderDao_1 = require("../dao/orderDao");
const bookDao_1 = require("../dao/bookDao");
class OrderController extends baseController_1.BaseController {
    constructor() {
        super();
    }
    getAllOrder() {
        return (req, res) => {
            console.log("returns order list");
            orderDao_1.OrderDao.getInstance().selectOrderDetailFromNo((response) => {
                console.log(response);
            }, req.params.MemberId);
        };
    }
    getOrderDetail() {
        return (req, res) => {
            console.log("returns order detail");
            orderDao_1.OrderDao.getInstance().selectOrderDetailFromNo((response) => {
                console.log(response);
            }, req.params.order_no);
        };
    }
    createNewOrder() {
        return (req, res) => {
            cartDao_1.CartDao.getInstance().selectCartFromNo((cart) => {
                if (cart != null) {
                    cartDao_1.CartDao.getInstance().selectCartDetailFromNo((books) => {
                        if (books.length > 0) {
                            var totalPrice = 0;
                            const id = uuid.v4();
                            var newBooks = Array();
                            for (var i = 0; i < books.length; i++) {
                                totalPrice += books[i].cart_price;
                                let tempBooks = {
                                    order_no: id,
                                    book_no: books[i].book_no,
                                    order_quantity: books[i].cart_quantity,
                                    order_price: books[i].cart_price,
                                };
                                newBooks.push(tempBooks);
                            }
                            let newOrder = {
                                order_no: id,
                                orderdate: "",
                                price: totalPrice,
                                member_no: cart.member_no,
                                credit_number: req.params.credit_number,
                                credit_kind: req.params.credit_kind,
                                credit_expiredate: req.params.credit_expiredate,
                                address_zipcode: req.params.address_zipcode,
                                address_address1: req.params.address_address1,
                                address_address2: req.params.address_address2,
                            };
                            const result = orderDao_1.OrderDao.getInstance().insertOrderFromCart(newOrder, newBooks, cart.cart_no);
                            console.log("insert Order : " + result);
                        }
                        else {
                            // 북정보 없을때
                        }
                    }, cart.cart_no);
                }
                else {
                    // 카드 정보 없을때 처리
                }
            }, req.params.cart_no);
        };
    }
    createNewOrderFromBook() {
        return (req, res) => {
            bookDao_1.BookDao.getInstance().selectBook((book) => {
                if (book != null) {
                    const count = Number(req.params.order_quantity);
                    const totalPrice = count * book.price;
                    const id = uuid.v4();
                    const newBooks = Array();
                    let tempBooks = {
                        order_no: id,
                        book_no: book.id,
                        order_quantity: count,
                        order_price: totalPrice,
                    };
                    newBooks.push(tempBooks);
                    let newOrder = {
                        order_no: id,
                        orderdate: "",
                        price: totalPrice,
                        member_no: req.params.member_no,
                        credit_number: req.params.credit_number,
                        credit_kind: req.params.credit_kind,
                        credit_expiredate: req.params.credit_expiredate,
                        address_zipcode: req.params.address_zipcode,
                        address_address1: req.params.address_address1,
                        address_address2: req.params.address_address2,
                    };
                    const result = orderDao_1.OrderDao.getInstance().insertOrderFromCart(newOrder, newBooks, null);
                    console.log("insert Order : " + result);
                }
            }, req.params.book_no);
        };
    }
}
exports.OrderController = OrderController;
