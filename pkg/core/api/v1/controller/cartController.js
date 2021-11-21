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
exports.CartController = void 0;
const baseController_1 = require("../../../controller/baseController");
const cartDao_1 = require("../dao/cartDao");
const uuid = __importStar(require("uuid"));
class CartController extends baseController_1.BaseController {
    constructor() {
        super();
    }
    getAllCart() {
        return (req, res) => {
            cartDao_1.CartDao.getInstance().selectAllCartFromMember((response) => {
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
    createNewCart() {
        return (req, res) => {
            console.log("request createNew Cart");
            let newCart = {
                cart_no: uuid.v4(),
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
