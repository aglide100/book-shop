import { BaseController } from "../../../controller/baseController";
import { Handler, Request, Response } from "express";
import { CartProps } from "../common/CartProps";
import { CartDao } from "../dao/cartDao";
import * as uuid from "uuid";

export class CartController extends BaseController {
  constructor() {
    super();
  }

  public getAllCart(): Handler {
    return (req: Request, res: Response) => {
      CartDao.getInstance().selectAllCartFromMember((response: any) => {
        res.send(response);
      }, req.params.MemberId);
    };
  }

  //   public getRecentCart(): Handler {
  //     return (req: Request, res: Response) => {
  //       let authHeader = req.headers["authorization"];
  //       let token = authHeader && authHeader.split(" ")[1];

  //       const id = this.authenticateAccessToken(token);
  //       if (id != null) {
  //         MemberDao.getInstance().selectMemberByNo(
  //           id,
  //           (err: Error, result: MemberProps) => {
  //             if (err != null) {
  //             }
  //           }
  //         );
  //       }
  //       console.log("return recent cart");
  //     };
  //   }

  public createNewCart(): Handler {
    return (req: Request, res: Response) => {
      console.log("request createNew Cart");
      let newCart: CartProps = {
        cart_no: uuid.v4(),
        member_no: req.body.memberNo,
        createdDate: req.body.createdDate,
      };

      let ok = CartDao.getInstance().insertNewCart(newCart);
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }
    };
  }

  public deleteCart(): Handler {
    return (req: Request, res: Response) => {
      let ok = CartDao.getInstance().deleteCart(req.params.CartId);
      if (ok == null) {
        res.status(200).send("done");
      } else {
        res.status(200).send("error :" + ok);
      }
    };
  }
}
