import { BaseDao } from "../../../DAO/baseDao";
import { OrderProps } from "../common/OrderProps";
import { OrderDetailProps } from "../common/OrderDetailProps";
export class OrderDao extends BaseDao {
  private static instance: OrderDao;

  constructor() {
    super();
  }

  public static getInstance(): OrderDao {
    if (!OrderDao.instance) {
      console.log("Creating OrderDao Instance...");
      OrderDao.instance = new OrderDao();
    }

    return OrderDao.instance;
  }

  public selectAllOrderFromMember(callback: Function, memberId: string) {
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
        let newCart: OrderProps = {
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

  public selectOrderDetailFromNo(callback: Function, no: string) {
    const q = `SELECT * FROM "Order_detail" WHERE order_no = $1`;
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
        let details: OrderDetailProps = {
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

  public async insertOrderFromCart(
    order: OrderProps,
    books: OrderDetailProps[],
    cart_no: string | null
  ) {
    console.log("Is it run? 4");

    var result = false;
    let client = this.getClient();
    try {
      // await client.query("BEGIN");
      console.log("Is it run? 5");
      const orderQ = `INSERT INTO "Order"(order_no, order_date, price, member_no, credit_number, credit_kind, credit_expiredate, address_zipcode, address_address1, address_address2) values ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)`;
      let res = client.query(orderQ, [
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

      console.log("Is it run? 6", res);

      for (var i = 0; i < books.length; i++) {
        console.log("book, " + i, books[i]);
        const booksQ = `INSERT INTO "Order_detail"(order_no, book_no, order_quantity, order_price) values ($1, $2, $3, $4)`;
        client.query(booksQ, [
          books[i].order_no,
          books[i].book_no,
          books[i].order_quantity,
          books[i].order_price,
        ]);

        const bookMiuns = `UPDATE "Book" SET quantity = quantity-$1 where book_no = $2`;
        client.query(bookMiuns, [books[i].order_quantity, books[i].book_no]);
      }

      if (cart_no != null) {
        const deleteQ = `DELETE FROM "Cart" WHERE cart_no = $1`;
        client.query(deleteQ, [cart_no]);
      }

      // await client.query("COMMIT");
      result = true;
    } catch (e) {
      // await client.query("ROLLBACK");
      throw e;
    } finally {
      await client.end();

      return await result;
    }
  }
}
