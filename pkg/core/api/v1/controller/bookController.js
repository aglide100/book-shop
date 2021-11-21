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
exports.BookController = void 0;
const baseController_1 = require("../../../controller/baseController");
const bookDao_1 = require("../dao/bookDao");
const uuid = __importStar(require("uuid"));
class BookController extends baseController_1.BaseController {
    constructor() {
        super();
    }
    getBooks() {
        return (req, res) => {
            console.log("returns Book list");
            bookDao_1.BookDao.getInstance().selectAllBook((response) => {
                res.send(JSON.stringify(response));
            });
        };
    }
    getBook() {
        return (req, res) => {
            console.log("request Book " + req.params.BookId + " get");
            bookDao_1.BookDao.getInstance().selectBook((response) => {
                res.send(JSON.stringify(response));
            }, req.params.BookId);
        };
    }
    createBook() {
        return (req, res) => {
            console.log("request create new Book!", req.body);
            const newBook = {
                id: uuid.v4(),
                title: req.body.title,
                author: req.body.author,
                quantity: req.body.quantity,
                price: req.body.price,
            };
            let ok = bookDao_1.BookDao.getInstance().insertNewBook(newBook);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
        };
    }
    deleteBook() {
        return (req, res) => {
            console.log("request delete Book " + req.params.BookId);
            let ok = bookDao_1.BookDao.getInstance().deleteBook(req.params.BookId);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
        };
    }
    updateBook() {
        return (req, res) => {
            console.log("request delete Book " + req.params.BookId);
            let ok = bookDao_1.BookDao.getInstance().updateBook(req.body);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
        };
    }
}
exports.BookController = BookController;
