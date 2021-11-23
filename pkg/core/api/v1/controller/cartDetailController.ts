import { BaseController } from "../../../controller/baseController";
import { Handler, Request, Response } from "express";
import { CartProps } from "../common/CartProps";
import { CartDetailDao } from "../dao/cartDetailDao";
import * as uuid from "uuid";
import { CartDetailProps } from "../common/CartDetailProps";
import { CartController } from "./cartController";
import { CartDao } from "../dao/cartDao";

export class CartDetailController extends BaseController {
  constructor() {
    super();
  }

  public getAllCartDetailFromCartNo(): Handler {
    return (req: Request, res: Response) => {
      CartDetailDao.getInstance().selectCartDetailFromCartNo(
        (response: any) => {
          res.send(response);
        },
        req.params.CartNo
      );
    };
  }

  public createNewCartDetail(): Handler {
    return (req: Request, res: Response) => {
      // console.log("createNewCartDetail", req.body.memberNo);

      CartDao.getInstance().getCartNoFromMemberNo((response: any) => {
        console.log("CART NO", response);

        let newCart: CartDetailProps = {
          cart_no: response.cart_no,
          book_no: req.body.book_no,
          cart_price: req.body.cart_price,
          cart_quantity: req.body.cart_quantity,
        };

        let ok = CartDetailDao.getInstance().insertNewCartDetail(newCart);
        if (ok == null) {
          res.status(200).send("done");
        } else {
          res.status(200).send("error :" + ok);
        }
      }, req.body.member_no);

      console.log("request createNew CartDetail");
    };
  }

  public updateCartDetail(): Handler {
    return (req: Request, res: Response) => {
      // console.log("createNewCartDetail", req.body.memberNo);

      let newCart: CartDetailProps = {
        cart_no: req.body.cart_no,
        book_no: req.body.book_no,
        cart_price: req.body.cart_price,
        cart_quantity: req.body.cart_quantity,
      };

      let ok = CartDetailDao.getInstance().updateCartDetail(newCart);
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }

      console.log("request update CartDetail");
    };
  }

  public deleteCartDetail(): Handler {
    return (req: Request, res: Response) => {
      let ok = CartDetailDao.getInstance().deleteCartDetail(
        req.params.CartNo,
        req.params.BookNo
      );
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }
    };
  }
}
