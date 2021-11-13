import { BaseController } from "../../../controller/baseController";
import { Handler, Request, response, Response } from "express";
import { BookProps } from "../common/BookProps";
import { BookDao } from "../dao/bookDao";
import * as uuid from "uuid";

export class BookController extends BaseController {
  constructor() {
    super();
  }

  public getBooks(): Handler {
    return (req: Request, res: Response) => {
      console.log("returns Book list");

      BookDao.getInstance().selectAllBook((response: any) => {
        res.send(JSON.stringify(response));
      });
    };
  }

  public getBook(): Handler {
    return (req: Request, res: Response) => {
      console.log("request Book " + req.params.BookId + " get");

      BookDao.getInstance().selectBook((response: any) => {
        res.send(JSON.stringify(response));
      }, req.params.BookId);
    };
  }

  public createBook(): Handler {
    return (req: Request, res: Response) => {
      console.log("request create new Book!", req.body);
      const newBook: BookProps = {
        id: uuid.v4(),
        title: req.body.title,
        author: req.body.author,
        quantity: req.body.quantity,
        price: req.body.price,
      };

      let ok = BookDao.getInstance().insertNewBook(newBook);
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }
    };
  }

  public deleteBook(): Handler {
    return (req: Request, res: Response) => {
      console.log("request delete Book " + req.params.BookId);

      let ok = BookDao.getInstance().deleteBook(req.params.BookId);
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }
    };
  }

  public updateBook(): Handler {
    return (req: Request, res: Response) => {
      console.log("request delete Book " + req.params.BookId);

      let ok = BookDao.getInstance().updateBook(req.body);
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }
    };
  }
}
