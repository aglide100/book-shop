"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const baseController_1 = require("../../../controller/baseController");
const cartDao_1 = require("../dao/cartDao");
class CartController extends baseController_1.BaseController {
    constructor() {
        super();
    }
    getAllCart() {
        return (req, res) => {
            cartDao_1.CartDao.getInstance().selectAllCartFromMember((response) => {
                console.log(response);
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
    createNewCart() {
        return (req, res) => {
            console.log("request createNew Cart");
            let newCart = {
                cart_no: req.body.cartNo,
                member_no: req.body.memberNo,
                createdDate: req.body.createdDate,
            };
            let ok = cartDao_1.CartDao.getInstance().insertNewCart(newCart);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
        };
    }
    deleteCart() {
        return (req, res) => {
            let ok = cartDao_1.CartDao.getInstance().deleteCart(req.params.CartId);
            if (ok == null) {
                res.status(200).send("done");
            }
            else {
                res.status(200).send("error :" + ok);
            }
        };
    }
}
exports.CartController = CartController;
