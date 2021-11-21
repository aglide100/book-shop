"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartDao = void 0;
const baseDao_1 = require("../../../DAO/baseDao");
class CartDao extends baseDao_1.BaseDao {
    constructor() {
        super();
    }
    static getInstance() {
        if (!CartDao.instance) {
            console.log("Creating CartDAO Instance...");
            CartDao.instance = new CartDao();
        }
        return CartDao.instance;
    }
    selectAllCartFromMember(callback, memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `SELECT * FROM "Cart" WHERE member_no = $1`;
            var client = this.getClient();
            function execQuery() {
                let data = Array();
                client.query(q, [memberId], (err, result) => {
                    if (err) {
                        console.log("Can't exec query!" + err);
                    }
                    const list = result.rows;
                    client.end();
                    for (var i = 0; i < list.length; i++) {
                        let newCart = {
                            cart_no: list[i].cart_no,
                            member_no: list[i].member_no,
                            createdDate: list[i].createdDate,
                        };
                        data.push(newCart);
                    }
                    callback(data);
                });
            }
            return yield execQuery();
        });
    }
    selectCartFromNo(callback, no) {
        const q = `SELECT * FROM "Cart" WHERE cart_no = $1`;
        var client = this.getClient();
        client.query(q, [no], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            const list = result.rows;
            // noinspection DuplicatedCode
            client.end();
            callback(list[0]);
        });
    }
    selectCartDetailFromNo(callback, no) {
        const q = `SELECT * FROM "Cart_Book" WHERE cart_no = $1`;
        var client = this.getClient();
        client.query(q, [no], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            const list = result.rows;
            let data = Array();
            // noinspection DuplicatedCode
            client.end();
            for (var i = 0; i < list.length; i++) {
                let details = {
                    cart_no: list[i].cart_no,
                    book_no: list[i].book_no,
                    cart_quantity: list[i].order_quantity,
                    cart_price: list[i].order_price,
                };
                data.push(details);
            }
            callback(data);
        });
    }
    insertNewCart(cart) {
        const q = `INSERT INTO "Cart"(cart_no, member_no, createdDate) values ($1, $2, $3)`;
        var client = this.getClient();
        client.query(q, [cart.cart_no, cart.member_no, cart.createdDate], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            console.log(result);
            client.end();
        });
    }
    deleteCart(id) {
        const q = `DELETE FROM "Cart" WHERE cart_no = $1`;
        var client = this.getClient();
        client.query(q, [id], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            client.end();
        });
    }
}
exports.CartDao = CartDao;
