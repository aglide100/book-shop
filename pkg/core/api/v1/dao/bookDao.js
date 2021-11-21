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
exports.BookDao = void 0;
const baseDao_1 = require("../../../DAO/baseDao");
class BookDao extends baseDao_1.BaseDao {
    constructor() {
        super();
    }
    static getInstance() {
        if (!BookDao.instance) {
            console.log("Creating BookDAO Instance...");
            BookDao.instance = new BookDao();
        }
        return BookDao.instance;
    }
    selectAllBook(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `SELECT * FROM "Book"`;
            var client = this.getClient();
            function execQuery() {
                let data = Array();
                client.query(q, (err, result) => {
                    if (err) {
                        console.log("Can't exec query!" + err);
                    }
                    const list = result.rows;
                    client.end();
                    for (var i = 0; i < list.length; i++) {
                        let newBook = {
                            title: list[i].title,
                            id: list[i].book_no,
                            quantity: list[i].quantity,
                            author: list[i].author,
                            price: list[i].price,
                        };
                        data.push(newBook);
                    }
                    callback(data);
                });
            }
            return yield execQuery();
        });
    }
    selectBook(callback, id) {
        const q = `SELECT * FROM "Book" WHERE book_no=$1`;
        var client = this.getClient();
        client.query(q, [id], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
            }
            client.end();
            console.log(id);
            const data = result.rows[0];
            if (data == undefined) {
                console.log("Can't get book in database");
                callback();
            }
            else {
                let newBook = {
                    title: data.title,
                    id: data.book_no,
                    quantity: data.quantity,
                    author: data.author,
                    price: data.price,
                };
                callback(newBook);
            }
        });
    }
    insertNewBook(book) {
        const q = `INSERT INTO "Book"(book_no, title, quantity, price, author) values ($1, $2, $3, $4, $5)`;
        var client = this.getClient();
        client.query(q, [book.id, book.title, book.quantity, book.price, book.author], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
                return err;
            }
            console.log(result);
            client.end();
        });
        return null;
    }
    deleteBook(id) {
        const q = `DELETE FROM "Book" WHERE book_no=$1`;
        var client = this.getClient();
        client.query(q, [id], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
                return err;
            }
            client.end();
        });
        return null;
    }
    updateBook(book) {
        const q = `UPDATE "Book"
    SET 
      title = $1,
      quantity = $2,
      price = $3,
        author = $4
    WHERE book_no = $5`;
        var client = this.getClient();
        client.query(q, [book.title, book.quantity, book.price, book.author, book.id], (err, result) => {
            if (err) {
                console.log("Can't exec query!" + err);
                return err;
            }
            client.end();
        });
        return null;
    }
}
exports.BookDao = BookDao;
