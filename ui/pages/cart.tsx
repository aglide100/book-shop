import React, { useState, useEffect, ReactElement } from "react";
import { Button } from "../components/Button";
import { BookProps } from "../components/BookItem";
import { InputField, ValidationResult } from "../components/InputField";
import * as axios from "axios";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "../utils/cookie";

export type CartProps = {
  book: BookProps;
  quantity: number;
};

type CartDetailProps = {
  cart_no: string;
  book_no: string;
  cart_qunaity: number;
  cart_price: number;
};

export const CartPage: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<CartProps[]>([]);

  type BookListProps = {
    books: CartProps[];
    onListChange: (args: BookListItemProps[]) => void;
  };

  type BookListItemProps = CartProps & {
    onQuantityChange?(value: number): void;
    onClickDelete?(id: string): void;
  };

  const BookItem = (props: BookListItemProps) => {
    let value = props.quantity;
    return (
      <div>
        <div className="flex flex-row w-screen justify-around">
          <div>도서 제목: {props.book.title}</div>
          <div>도서 저자: {props.book.author}</div>
          <div>도서 가격: {props.book.price}</div>
          <div>
            수량:{" "}
            <input
              type="number"
              placeholder="수량"
              value={value}
              onChange={(ev) => {
                props.onQuantityChange(parseInt(ev.target.value));
              }}
            ></input>
          </div>
          <div
            onClick={(ev) => {
              ev.preventDefault();
              props.onClickDelete(props.book.id);
            }}
          >
            삭제
          </div>
        </div>
      </div>
    );
  };

  const BookList = (props: BookListProps) => {
    const [argList, setArgList] = useState<BookListItemProps[]>(props.books);
    let totalPrice = 0;
    let argumentList;
    const onQuantityChange = (id: string, value: number): void => {
      const newArgList = argList.map((arg) => {
        if (arg != undefined) {
          if (arg.book.id == id) {
            return { ...arg, quantity: value };
          }
          return arg;
        }
      });
      setArgList(newArgList);
      props.onListChange(newArgList);
    };

    const onClickDelete = (id: string): void => {
      const newArgList = argList.map((arg) => {
        if (arg.book.id == id) {
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
          totalPrice += arg.book.price * arg.quantity;
          return (
            <li key={arg.book.id + index}>
              <BookItem
                book={arg.book}
                quantity={arg.quantity}
                onQuantityChange={(value) => {
                  onQuantityChange(arg.book.id, value);
                }}
                onClickDelete={(value) => {
                  onClickDelete(value);
                }}
              ></BookItem>
            </li>
          );
        }
      });
    } else {
      argumentList = <>리스트가 없습니다!</>;
      totalPrice = 0;
    }

    return (
      <>
        <ul>{argumentList.length == 0 ? <></> : argumentList}</ul>
        <div>주문 총액: {totalPrice}</div>
      </>
    );
  };

  useEffect(() => {
    let tempData: CartDetailProps[];
    let bookDatas = new Array();

    console.log("Checking isLoading...");
    if (isLoading) {
      const axiosObj = axios.default;
      console.log("fetching cart data...");
      axiosObj
        .get("http://localhost:4000/api/v1/cart/" + getCookie("member_no"))
        .then((res) => {
          console.log(res.data[0].cart_no);
          setCookie("cartNo", res.data[0].cart_no);
          axiosObj
            .get(
              "http://localhost:4000/api/v1/cartDetail/" + res.data[0].cart_no
            )
            .then((response) => {
              tempData = response.data;
              let listLength = tempData.length;
              if (listLength == 0) {
                setIsLoading(false);
              }

              tempData.map((cartDetail) => {
                axiosObj
                  .get(
                    "http://localhost:4000/api/v1/books/" + cartDetail.book_no
                  )
                  .then((res) => {
                    console.log("reading res", res.data);

                    let newBook: BookProps = {
                      id: res.data.id,
                      title: res.data.title,
                      author: res.data.author,
                      quantity: res.data.quantity,
                      price: res.data.price,
                    };
                    let newCartData: CartProps = {
                      book: newBook,
                      quantity: cartDetail.cart_qunaity,
                    };

                    const list = data;
                    list.push(newCartData);

                    setData(list);
                    listLength--;
                  })
                  .finally(() => {
                    console.log("마지막에 실행?", data);

                    if (listLength == 0 || listLength <= 0) {
                      setIsLoading(false);
                    }
                  });
              });
            });
        });
    }
  }, []);

  return (
    <div>
      장바구니
      <div>
        {isLoading ? (
          <>불러오는 중...</>
        ) : (
          <div className="flex flex-col">
            <BookList
              books={data}
              onListChange={(e) => {
                setData(e);
              }}
            ></BookList>
            <div>주문</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
