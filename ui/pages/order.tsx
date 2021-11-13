import React, { ReactElement, useState } from "react";
import { BookProps } from "../components/BookItem";
import { Button } from "../components/Button";
import { useRouter } from "next/router";
import * as axios from "axios";
import { useEffect } from "react";

export type OrderProps = {
  book: BookProps;
  quantity: number;
};

type BookListProps = {
  books: OrderProps[];
  onListChange: (args: BookListItemProps[]) => void;
};

type BookListItemProps = OrderProps & {
  onQuantityChange?(value: number): void;
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
      </div>
    </div>
  );
};

export const BookList = (props: BookListProps) => {
  const [argList, setArgList] = useState<BookListItemProps[]>(props.books);
  let totalPrice = 0;
  const onQuantityChange = (id: string, value: number): void => {
    const newArgList = argList.map((arg) => {
      if (arg.book.id == id) {
        return { ...arg, quantity: value };
      }
      return arg;
    });
    setArgList(newArgList);
    props.onListChange(newArgList);
  };

  const argumentList = argList.map((arg, index) => {
    totalPrice += arg.book.price * arg.quantity;
    return (
      <li key={arg.book.id + index}>
        <BookItem
          book={arg.book}
          quantity={arg.quantity}
          onQuantityChange={(value) => {
            onQuantityChange(arg.book.id, value);
          }}
        ></BookItem>
      </li>
    );
  });

  return (
    <>
      <ul>{argumentList.length == 0 ? <></> : argumentList}</ul>
      <div>주문 총액: {totalPrice}</div>
    </>
  );
};

export const OrderPage: React.FC<{}> = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);

  const [books, setBooks] = useState<OrderProps[]>([]);
  const [argList, setArgList] = useState<BookListItemProps[]>([]);

  let totalPrice = 0;

  //   const [totalPrice, setTotalPrice] = useState<number>(0);

  let table: ReactElement;

  const queryObj = router.query;
  console.log("queryObj : " + queryObj);

  useEffect(() => {
    if (isLoading) {
      if (queryObj.bookId.length > 1) {
        console.log("장바구니 없이 단일로 주문" + queryObj.bookId);

        fetchBookData(queryObj.bookId.toString());
      } else {
        const cartId = queryObj.memberId;
        console.log("장바구니 불러오는 중...." + cartId);
        // fetchBookListData(cartId[0]);
      }
    }
  }, []);

  function fetchBookData(bookId: string) {
    const axiosObj = axios.default;
    axiosObj
      .get("http://localhost:4000/api/v1/books/" + bookId)
      .then((response) => {
        let book: OrderProps = {
          book: {
            id: response.data.id,
            title: response.data.title,
            author: response.data.author,
            quantity: response.data.quantity,
            price: response.data.price,
          },
          //   아이템에서 바로 주문으로 넘어와서 0으로 처리
          quantity: 1,
        };
        let newBooks = books.map((book) => {
          return book;
        });
        newBooks.push(book);

        setBooks(newBooks);
        setIsLoading(false);
      });
  }

  function fetchBookListData(memberId: string) {
    const axiosObj = axios.default;
    axiosObj
      .get("http://localhost:4000/api/v1/cart/" + memberId)
      .then((response) => {});
  }

  function renderTotalPrice() {
    const totalPriceRender = (
      <div className="flex flex-row">
        총 주문금액:{" "}
        {isNaN(totalPrice) ? (
          <span>수량을 확인해주십시오</span>
        ) : (
          <span>{totalPrice}</span>
        )}
      </div>
    );

    return totalPriceRender;
  }

  if (isLoading) {
    table = <>불러오는 중....</>;
  } else {
    table = (
      <BookList
        books={books}
        onListChange={(args) => {
          setArgList(args);
        }}
      ></BookList>
    );
  }

  return (
    <div className="flex w-screen flex-col">
      <div>
        {/* <div>
          배송지 입력
          <input type="number">배송지 우편번호</input>
          <input type="text">기본주소</input>
          <input type="text">상세주소</input>
        </div>
        <div>
          카드 정보 입력
          <input type="text">신용카드 종류</input>
          <input type="text">신용카드 번호</input>
          <input type="text">신용카드 유효기간</input>
        </div> */}
      </div>
      {table}

      <div className="flex flex-row">
        <Button
          size="medium"
          type="button"
          color="gray"
          isDisabled={false}
          onClick={(ev) => {
            ev.preventDefault();
            alert("주문중");
          }}
        >
          주문
        </Button>
        <Button
          size="medium"
          type="button"
          color="gray"
          isDisabled={false}
          onClick={(ev) => {
            ev.preventDefault();
            router.push("/");
          }}
        >
          취소
        </Button>
      </div>
    </div>
  );
};

export default OrderPage;
