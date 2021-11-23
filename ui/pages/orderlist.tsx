import React, { useState, useEffect, ReactElement } from "react";
import { Button } from "../components/Button";
import { InputField, ValidationResult } from "../components/InputField";
import * as axios from "axios";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "../utils/cookie";

export type OrderProps = {
  order_no: string;
  orderdate: string;
  price: string;
  credit_number: string;
  credit_kind: string;
  credit_expiredate: string;
  address_zipcode: string;
  address_address1: string;
  address_address2: string;
};

export const OrderListPage: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<OrderProps[]>([]);

  const [originData, setOriginData] = useState<OrderProps[]>([]);

  const router = useRouter();

  type OrderListProps = {
    orders: OrderProps[];
    onListChange: (args: OrderListItemProps[]) => void;
  };

  type OrderListItemProps = OrderProps & {
    onClickDelete?(id: string): void;
  };

  const OrderItem = (props: OrderListItemProps) => {
    // let value = props.quantity;
    return (
      <div>
        <div className="flex flex-row w-screen justify-around">
          <div>주문 날짜: {props.orderdate}</div>
          <div>주문 금액: {props.price}</div>

          {/* <div
            onClick={(ev) => {
              ev.preventDefault();
              props.onClickDelete(props.order_no);
            }}
          >
            삭제
          </div> */}
        </div>
      </div>
    );
  };

  const OrderList = (props: OrderListProps) => {
    const [argList, setArgList] = useState<OrderListItemProps[]>(props.orders);
    let argumentList;

    const onClickDelete = (id: string): void => {
      const newArgList = argList.map((arg) => {
        if (arg.order_no == id) {
          // pass
        } else {
          return arg;
        }
      });
      setArgList(newArgList);
      props.onListChange(newArgList);
      const axiosObj = axios.default;
      axiosObj
        .delete(
          "http://localhost:4000/api/v1/cartDetail/" +
            getCookie("cartNo") +
            "/" +
            id
        )
        .then((res) => {
          alert(res.data);
        });
    };

    console.log("argList!", argList);
    if (argList.length >= 1) {
      argumentList = argList.map((arg, index) => {
        if (arg == undefined) {
          // passed
        } else {
          return (
            <li key={arg.order_no}>
              <OrderItem
                order_no={arg.order_no}
                orderdate={arg.orderdate}
                price={arg.price}
                credit_number={arg.credit_number}
                credit_kind={arg.credit_kind}
                credit_expiredate={arg.credit_expiredate}
                address_address1={arg.address_address1}
                address_address2={arg.address_address2}
                address_zipcode={arg.address_zipcode}
                onClickDelete={(value) => {
                  onClickDelete(value);
                }}
              ></OrderItem>
            </li>
          );
        }
      });
    } else {
      argumentList = <>리스트가 없습니다!</>;
    }

    return (
      <>
        <ul>
          {argumentList.length == 0 ? <>주문내역이 없습니다!</> : argumentList}
        </ul>
      </>
    );
  };

  useEffect(() => {
    // let tempData: CartDetailProps[];

    console.log("Checking isLoading...");
    if (isLoading) {
      const axiosObj = axios.default;
      console.log("fetching cart data...");
      axiosObj
        .get("http://localhost:4000/api/v1/orders/" + getCookie("member_no"))
        .then((res) => {
          console.log("reading res...", res.data);

          let data = new Array();

          if (res.data == undefined) {
            alert("주문내역이 없습니다!");
          } else {
            const list = res.data;

            list.map((order) => {
              let newOrder: OrderProps = {
                order_no: order.order_no,
                orderdate: order.orderdate,
                price: order.price,
                credit_number: order.credit_number,
                credit_kind: order.credit_kind,
                credit_expiredate: order.credit_expiredate,
                address_zipcode: order.address_zipcode,
                address_address1: order.address_address1,
                address_address2: order.address_address2,
              };

              data.push(newOrder);
            });

            setData(data);
            setIsLoading(false);
          }
        });
    }
  }, []);

  return (
    <div>
      <div>주문내역</div>
      <div>
        {isLoading ? (
          <>불러오는 중...</>
        ) : (
          <div className="flex flex-col">
            <OrderList
              orders={data}
              onListChange={(e) => {
                setData(e);
              }}
            ></OrderList>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default OrderListPage;
