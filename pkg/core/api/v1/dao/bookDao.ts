import { BaseDao } from "../../../DAO/baseDao";
import { BookProps } from "../common/BookProps";

export class BookDao extends BaseDao {
  private static instance: BookDao;

  constructor() {
    super();
  }

  public static getInstance(): BookDao {
    if (!BookDao.instance) {
      console.log("Creating BookDAO Instance...");
      BookDao.instance = new BookDao();
    }

    return BookDao.instance;
  }

  public async selectAllBook(callback: Function) {
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
          let newBook: BookProps = {
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

    return await execQuery();
  }

  public selectBook(callback: Function, id: string) {
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
      } else {
        let newBook: BookProps = {
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

  public insertNewBook(book: BookProps): Error | null {
    const q = `INSERT INTO "Book"(book_no, title, quantity, price, author) values ($1, $2, $3, $4, $5)`;

    var client = this.getClient();

    client.query(
      q,
      [book.id, book.title, book.quantity, book.price, book.author],
      (err, result) => {
        if (err) {
          console.log("Can't exec query!" + err);
          return err;
        }

        console.log(result);

        client.end();
      }
    );
    return null;
  }

  public deleteBook(id: string): Error | null {
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

  public updateBook(book: BookProps): Error | null {
    const q = `UPDATE "Book"
    SET 
      title = $1,
      quantity = $2,
      price = $3,
        author = $4
    WHERE book_no = $5`;

    var client = this.getClient();

    client.query(
      q,
      [book.title, book.quantity, book.price, book.author, book.id],
      (err, result) => {
        if (err) {
          console.log("Can't exec query!" + err);
          return err;
        }

        client.end();
      }
    );

    return null;
  }
}
