"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartDetailController = void 0;
const baseController_1 = require("../../../controller/baseController");
const cartDetailDao_1 = require("../dao/cartDetailDao");
const cartDao_1 = require("../dao/cartDao");
class CartDetailController extends baseController_1.BaseController {
    constructor() {
        super();
    }
    getAllCartDetailFromCartNo() {
        return (req, res) => {
            cartDetailDao_1.CartDetailDao.getInstance().selectCartDetailFromCartNo((response) => {
                res.send(response);
            }, req.params.CartNo);
        };
    }
    createNewCartDetail() {
        return (req, res) => {
            // console.log("createNewCartDetail", req.body.memberNo);
            cartDao_1.CartDao.getInstance().getCartNoFromMemberNo((response) => {
                console.log("CART NO", response);
                let newCart = {
                    cart_no: response.cart_no,
                    book_no: req.body.book_no,
                    cart_price: req.body.cart_price,
                    cart_quantity: req.body.cart_quantity,
                };
                let ok = cartDetailDao_1.CartDetailDao.getInstance().insertNewCartDetail(newCart);
                if (ok == null) {
                    res.status(200).send("done");
                }
                else {
                    res.status(200).send("error :" + ok);
                }
            }, req.body.member_no);
            console.log("request createNew CartDetail");
        };
    }
    updateCartDetail() {
        return (req, res) => {
            // console.log("createNewCartDetail", req.body.memberNo);
            let newCart = {
                cart_no: req.body.cart_no,
                book_no: req.body.book_no,
                cart_price: req.body.cart_price,
                cart_quantity: req.body.cart_quantity,
            };
            let ok = cartDetailDao_1.CartDetailDao.getInstance().updateCartDetail(newCart);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
            console.log("request update CartDetail");
        };
    }
    deleteCartDetail() {
        return (req, res) => {
            let ok = cartDetailDao_1.CartDetailDao.getInstance().deleteCartDetail(req.params.CartNo, req.params.BookNo);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
        };
    }
}
exports.CartDetailController = CartDetailController;
