import { BaseDao } from "../../../DAO/baseDao";
import { CartProps } from "../common/CartProps";
import { CartBookProps } from "../common/CartBookProps";
import * as uuid from "uuid";

export class CartDao extends BaseDao {
  private static instance: CartDao;

  constructor() {
    super();
  }

  public static getInstance(): CartDao {
    if (!CartDao.instance) {
      console.log("Creating CartDAO Instance...");
      CartDao.instance = new CartDao();
    }

    return CartDao.instance;
  }

  public async selectAllCartFromMember(callback: Function, memberId: string) {
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
          let newCart: CartProps = {
            cart_no: list[i].cart_no,
            member_no: list[i].member_no,
            createdDate: list[i].createdDate,
          };

          data.push(newCart);
        }

        callback(JSON.stringify(data));
      });
    }

    return await execQuery();
  }

  public selectCartFromNo(callback: Function, no: string) {
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

  public async getCartNoFromMemberNo(callback: Function, memberNo: string) {
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
        let cart: CartProps = {
          cart_no: newCartNo,
          member_no: memberNo,
          createdDate: "",
        };
        this.insertNewCart(cart).then((res) => {
          console.log("creating.....", cart, res);
          callback(cart);
        });
      } else {
        callback(result.rows[0]);
      }

      client.end();
    });
  }

  public selectCartDetailFromNo(callback: Function, no: string) {
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
        console.log(
          "before !!!!!!!!!!!!",
          list[i].cart_no,
          list[i].book_no,
          list[i].cart_quantity,
          list[i].cart_price
        );
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

  public async insertNewCart(cart: CartProps) {
    const q = `INSERT INTO "Cart"(cart_no, member_no, create_date) values ($1, $2, NOW())`;

    console.log("InsertNewCart , ", cart);
    var client = this.getClient();

    client.query(q, [cart.cart_no, cart.member_no], (err, result) => {
      if (err) {
        console.log("Can't exec query! Insert New Cart" + err);
      }

      client.end();
    });
  }

  public deleteCart(id: string) {
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
