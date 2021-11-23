import { BaseController } from "../../../controller/baseController";
import { Handler, Request, response, Response } from "express";
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
      OrderDao.getInstance().selectAllOrderFromMember((response: any) => {
        console.log(response);
        res.send(response);
      }, req.params.MemberId);

      // OrderDao.getInstance().selectOrderDetailFromNo((response: any) => {
      //   console.log(response);
      //   res.send(response)
      // }, req.params.MemberId);
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
    var newBooks = new Array();
    return (req: Request, res: Response) => {
      console.log("Cart No in createNewOrder", req.params.cart_no);
      CartDao.getInstance().selectCartFromNo((cart: any) => {
        if (cart != null) {
          console.log("Is it run? 1 cart", cart);
          CartDao.getInstance().selectCartDetailFromNo((books: any) => {
            if (books.length > 0) {
              var totalPrice = 0;
              const id = uuid.v4();

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
                credit_number: req.body.credit_number,
                credit_kind: req.body.credit_kind,
                credit_expiredate: req.body.credit_expiredate,
                address_zipcode: req.body.address_zipcode,
                address_address1: req.body.address_address1,
                address_address2: req.body.address_address2,
                discount: req.body.discount,
              };

              let result = OrderDao.getInstance().insertOrderFromCart(
                newOrder,
                newBooks,
                cart.cart_no,
                () => {
                  res.send("done");
                }
              );

              // result.finally(() => {
              //   console.log("insert Order : 바깥");
              // });
            } else {
              // 북정보 없을때
            }
          }, cart.cart_no);
        } else {
          // 카드 정보 없을때 처리
        }
      }, req.body.cart_no);
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
            member_no: req.body.member_no,
            credit_number: req.body.credit_number,
            credit_kind: req.body.credit_kind,
            credit_expiredate: req.body.credit_expiredate,
            address_zipcode: req.body.address_zipcode,
            address_address1: req.body.address_address1,
            address_address2: req.body.address_address2,
            discount: req.body.discount,
          };

          const result = OrderDao.getInstance().insertOrderFromCart(
            newOrder,
            newBooks,
            null,
            () => {
              res.send("done");
            }
          );
        }
      }, req.body.book_no);
    };
  }
}
