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
exports.OrderDao = void 0;
const baseDao_1 = require("../../../DAO/baseDao");
class OrderDao extends baseDao_1.BaseDao {
    constructor() {
        super();
    }
    static getInstance() {
        if (!OrderDao.instance) {
            console.log("Creating OrderDao Instance...");
            OrderDao.instance = new OrderDao();
        }
        return OrderDao.instance;
    }
    selectAllOrderFromMember(callback, memberId) {
        const q = `SELECT * FROM "Order" WHERE member_no = $1`;
        var client = this.getClient();
        client.query(q, [memberId], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            const list = result.rows;
            let data = Array();
            // noinspection DuplicatedCode
            client.end();
            for (var i = 0; i < list.length; i++) {
                let newCart = {
                    order_no: list[i].order_no,
                    orderdate: list[i].orderdate,
                    price: list[i].price,
                    member_no: list[i].member_no,
                    credit_number: list[i].credit_number,
                    credit_kind: list[i].credit_kind,
                    credit_expiredate: list[i].credit_expiredate,
                    address_zipcode: list[i].address_zipcode,
                    address_address1: list[i].address_address1,
                    address_address2: list[i].address_address2,
                };
                data.push(newCart);
            }
            callback(data);
        });
    }
    selectOrderDetailFromNo(callback, no) {
        const q = `SELECT * FROM "Order_detail" WHERE order_no = $1`;
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
                    order_no: list[i].order_no,
                    book_no: list[i].book_no,
                    order_quantity: list[i].order_quantity,
                    order_price: list[i].order_price,
                };
                data.push(details);
            }
            callback(data);
        });
    }
    insertOrderFromCart(order, books, cart_no) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = false;
            const client = this.getClient();
            try {
                yield client.query("BEGIN");
                const orderQ = `INSERT INTO "Order"(order_no, order_date, price, member_no, credit_number, credit_kind, credit_expiredate, address_zipcode, address_address1, address_address2) values ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
                const res = yield client.query(orderQ, [
                    order.order_no,
                    order.price,
                    order.member_no,
                    order.credit_number,
                    order.credit_kind,
                    order.credit_expiredate,
                    order.address_zipcode,
                    order.address_address1,
                    order.address_address2,
                ]);
                for (var i = 0; i < books.length; i++) {
                    const booksQ = `INSERT INTO "Order_detail"(order_no, book_no, order_quantity, order_price) values ($1, $2, $3, $4)`;
                    yield client.query(booksQ, [
                        books[i].order_no,
                        books[i].book_no,
                        books[i].order_quantity,
                        books[i].order_price,
                    ]);
                    const bookMiuns = `UPDATE "Book" SET quantity = quantity-1 where book_no = $1`;
                    yield client.query(bookMiuns, [books[i].book_no]);
                }
                if (cart_no != null) {
                    const deleteQ = `DELETE FROM "Cart" WHERE cart_no = $1`;
                    yield client.query(deleteQ, [cart_no]);
                }
                yield client.query("COMMIT");
                result = true;
            }
            catch (e) {
                yield client.query("ROLLBACK");
                throw e;
            }
            finally {
                yield client.end();
            }
            return result;
        });
    }
}
exports.OrderDao = OrderDao;
