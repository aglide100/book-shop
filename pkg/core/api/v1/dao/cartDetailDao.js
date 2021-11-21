"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartDetailDao = void 0;
const baseDao_1 = require("../../../DAO/baseDao");
class CartDetailDao extends baseDao_1.BaseDao {
    constructor() {
        super();
    }
    static getInstance() {
        if (!CartDetailDao.instance) {
            console.log("Creating CartDetailDAO Instance...");
            CartDetailDao.instance = new CartDetailDao();
        }
        return CartDetailDao.instance;
    }
    // public async selectAllCartFromMember(callback: Function, memberId: string) {
    //   const q = `SELECT * FROM "Cart" WHERE member_no = $1`;
    //   var client = this.getClient();
    //   function execQuery() {
    //     let data = Array();
    //     client.query(q, [memberId], (err, result) => {
    //       if (err) {
    //         console.log("Can't exec query!" + err);
    //       }
    //       const list = result.rows;
    //       client.end();
    //       for (var i = 0; i < list.length; i++) {
    //         let newCart: CartProps = {
    //           cart_no: list[i].cart_no,
    //           member_no: list[i].member_no,
    //           createdDate: list[i].createdDate,
    //         };
    //         data.push(newCart);
    //       }
    //       callback(data);
    //     });
    //   }
    //   return await execQuery();
    // }
    selectCartDetailFromCartNo(callback, cartNo) {
        const q = `SELECT * FROM "Cart_Book" WHERE cart_no = $1`;
        var client = this.getClient();
        client.query(q, [cartNo], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            const list = result.rows;
            console.log("CartDetail list", list);
            const array = list.map((cartDetail) => {
                let item = {
                    cart_no: cartDetail.cart_no,
                    book_no: cartDetail.book_no,
                    cart_qunaity: cartDetail.cart_quantity,
                    cart_price: cartDetail.cart_price,
                };
                return item;
            });
            // noinspection DuplicatedCode
            client.end();
            callback(JSON.stringify(array));
        });
    }
    // public selectCartDetailFromNo(callback: Function, no: string) {
    //   const q = `SELECT * FROM "Cart_Book" WHERE cart_no = $1`;
    //   var client = this.getClient();
    //   client.query(q, [no], (err, result) => {
    //     if (err) {
    //       console.log("Can't exec query!" + err);
    //     }
    //     const list = result.rows;
    //     let data = Array();
    //     // noinspection DuplicatedCode
    //     client.end();
    //     for (var i = 0; i < list.length; i++) {
    //       let details: CartBookProps = {
    //         cart_no: list[i].cart_no,
    //         book_no: list[i].book_no,
    //         cart_quantity: list[i].order_quantity,
    //         cart_price: list[i].order_price,
    //       };
    //       data.push(details);
    //     }
    //     callback(data);
    //   });
    // }
    insertNewCartDetail(cartDetail) {
        // console.log("insertNewCartDetail ,", cartDetail);
        // const q = `INSERT INTO "Cart_Book"(book_no, cart_no, cart_quantity, cart_price) values ($1, $2, $3, $4)`;
        const q = `INSERT INTO "Cart_Book" (book_no, cart_no, cart_quantity, cart_price) VALUES ($1, $2, $3, $4)`;
        var client = this.getClient();
        client.query(q, [
            cartDetail.book_no,
            cartDetail.cart_no,
            cartDetail.cart_qunaity,
            cartDetail.cart_price,
        ], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            console.log(result);
            client.end();
        });
    }
    updateCartDetail(cartDetail) {
        console.log("insertNewCartDetail ,", cartDetail);
        const q = `UPDATE "Cart_Book" SET book_no = $1, cart_no = $2, cart_quantity = $3, cart_price = $4 WHERE  book_no = $1 AND cart_no = $2`;
        var client = this.getClient();
        client.query(q, [
            cartDetail.book_no,
            cartDetail.cart_no,
            cartDetail.cart_qunaity,
            cartDetail.cart_price,
        ], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            console.log(result);
            client.end();
        });
    }
    deleteCartDetail(cartNo, bookNo) {
        const q = `DELETE FROM "Cart_Book" WHERE cart_no = $1 AND book_no = $2`;
        var client = this.getClient();
        client.query(q, [cartNo, bookNo], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            client.end();
        });
    }
}
exports.CartDetailDao = CartDetailDao;
