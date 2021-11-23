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
const uuid = __importStar(require("uuid"));
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
                    callback(JSON.stringify(data));
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
            console.log("Is it run? 2", list);
            // noinspection DuplicatedCode
            callback(result.rows[0]);
            client.end();
        });
    }
    getCartNoFromMemberNo(callback, memberNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `SELECT * FROM "Cart" WHERE member_no = $1`;
            var client = this.getClient();
            client.query(q, [memberNo], (err, result) => {
                if (err) {
                    console.log("Can't exec query!" + err);
                    return err;
                }
                if (result.rows.length == 0 || result.rows[0] == undefined) {
                    console.log("There is no Cart! creating new one....", memberNo);
                    const newCartNo = uuid.v4();
                    let cart = {
                        cart_no: newCartNo,
                        member_no: memberNo,
                        createdDate: "",
                    };
                    this.insertNewCart(cart).then((res) => {
                        console.log("creating.....", cart, res);
                        callback(cart);
                    });
                }
                else {
                    callback(result.rows[0]);
                }
                client.end();
            });
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
            let data = new Array();
            // noinspection DuplicatedCode
            client.end();
            for (var i = 0; i < list.length; i++) {
                console.log("before !!!!!!!!!!!!", list[i].cart_no, list[i].book_no, list[i].cart_quantity, list[i].cart_price);
                let details = {
                    cart_no: list[i].cart_no,
                    book_no: list[i].book_no,
                    cart_quantity: list[i].cart_quantity,
                    cart_price: list[i].cart_price,
                };
                data.push(details);
            }
            console.log("look here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", list);
            callback(data);
        });
    }
    insertNewCart(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `INSERT INTO "Cart"(cart_no, member_no, create_date) values ($1, $2, NOW())`;
            console.log("InsertNewCart , ", cart);
            var client = this.getClient();
            client.query(q, [cart.cart_no, cart.member_no], (err, result) => {
                if (err) {
                    console.log("Can't exec query! Insert New Cart" + err);
                }
                client.end();
            });
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
