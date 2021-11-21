import { BaseController } from "../../../controller/baseController";
import { Handler, Request, Response } from "express";
import * as uuid from "uuid";
import { CartDao } from "../dao/cartDao";
import { OrderDao } from "../dao/orderDao";
import { CartProps } from "../common/CartProps";
import { OrderProps } from "../common/OrderProps";
import { CartBookProps } from "../common/CartBookProps";
import { OrderDetailProps } from "../common/OrderDetailProps";
import { BookDao } from "../dao/bookDao";
import { BookProps } from "../common/BookProps";

export class OrderController extends BaseController {
  constructor() {
    super();
  }

  public getAllOrder(): Handler {
    return (req: Request, res: Response) => {
      console.log("returns order list");
      OrderDao.getInstance().selectOrderDetailFromNo((response: any) => {
        console.log(response);
      }, req.params.MemberId);
    };
  }

  public getOrderDetail(): Handler {
    return (req: Request, res: Response) => {
      console.log("returns order detail");
      OrderDao.getInstance().selectOrderDetailFromNo((response: any) => {
        console.log(response);
      }, req.params.order_no);
    };
  }

  public createNewOrder(): Handler {
    return (req: Request, res: Response) => {
      CartDao.getInstance().selectCartFromNo((cart: CartProps) => {
        if (cart != null) {
          CartDao.getInstance().selectCartDetailFromNo(
            (books: [CartBookProps]) => {
              if (books.length > 0) {
                var totalPrice = 0;
                const id = uuid.v4();
                var newBooks = Array();
                for (var i = 0; i < books.length; i++) {
                  totalPrice += books[i].cart_price;
                  let tempBooks: OrderDetailProps = {
                    order_no: id,
                    book_no: books[i].book_no,
                    order_quantity: books[i].cart_quantity,
                    order_price: books[i].cart_price,
                  };
                  newBooks.push(tempBooks);
                }

                let newOrder: OrderProps = {
                  order_no: id,
                  orderdate: "",
                  price: totalPrice,
                  member_no: cart.member_no,
                  credit_number: req.params.credit_number,
                  credit_kind: req.params.credit_kind,
                  credit_expiredate: req.params.credit_expiredate,
                  address_zipcode: req.params.address_zipcode,
                  address_address1: req.params.address_address1,
                  address_address2: req.params.address_address2,
                };

                const result = OrderDao.getInstance().insertOrderFromCart(
                  newOrder,
                  newBooks,
                  cart.cart_no
                );
                console.log("insert Order : " + result);
              } else {
                // 북정보 없을때
              }
            },
            cart.cart_no
          );
        } else {
          // 카드 정보 없을때 처리
        }
      }, req.params.cart_no);
    };
  }

  public createNewOrderFromBook(): Handler {
    return (req: Request, res: Response) => {
      BookDao.getInstance().selectBook((book: BookProps) => {
        if (book != null) {
          const count = Number(req.params.order_quantity);
          const totalPrice = count * book.price;
          const id = uuid.v4();
          const newBooks = Array();
          let tempBooks: OrderDetailProps = {
            order_no: id,
            book_no: book.id,
            order_quantity: count,
            order_price: totalPrice,
          };
          newBooks.push(tempBooks);

          let newOrder: OrderProps = {
            order_no: id,
            orderdate: "",
            price: totalPrice,
            member_no: req.params.member_no,
            credit_number: req.params.credit_number,
            credit_kind: req.params.credit_kind,
            credit_expiredate: req.params.credit_expiredate,
            address_zipcode: req.params.address_zipcode,
            address_address1: req.params.address_address1,
            address_address2: req.params.address_address2,
          };

          const result = OrderDao.getInstance().insertOrderFromCart(
            newOrder,
            newBooks,
            null
          );
          console.log("insert Order : " + result);
        }
      }, req.params.book_no);
    };
  }
}
