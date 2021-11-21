import React, { ReactElement, useEffect, useState } from "react";
import { BookItem, BookProps } from "./BookItem";
import { AnimateSharedLayout, motion } from "framer-motion";
import * as axios from "axios";
import { getCookie } from "../utils/cookie";

export type BookListProps = {
  books: BookProps[];
};

const BookList = () => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [searchKeyWord, setSearchKeyWord] = useState<string>("");

  let bookList: ReactElement;

  const token = getCookie("user");

  useEffect(() => {
    if (!isLoaded && token) {
      fetchBookList();
    }
  }, []);

  function fetchBookList() {
    const axiosObj = axios.default;
    axiosObj.get("http://localhost:4000/api/v1/books").then((response) => {
      setData(response.data);
      console.log(response.data);
      setIsLoaded(true);
    });
  }

  if (data == null || data == undefined || Object.keys(data).length === 0) {
    bookList = (
      <>
        <div>책이 없습니다!</div>
      </>
    );
  } else {
    bookList = data.map((book, index) => {
      // console.log("Creating Book Item..." + index + book.title);
      let bookTitle = book.title;
      if (bookTitle.includes(searchKeyWord)) {
        return (
          <div key={"book" + index}>
            <BookItem
              id={book.id}
              title={book.title}
              author={book.author}
              quantity={book.quantity}
              price={book.price}
            ></BookItem>
          </div>
        );
      }
    });
  }

  return (
    <>
      <AnimateSharedLayout>
        <div>
          <span>검색 </span>
          <input
            type="text"
            className="w-80"
            placeholder="검색할 제목을 입력해주세요."
            value={searchKeyWord}
            onChange={(e) => {
              setSearchKeyWord(e.target.value);
            }}
          ></input>
        </div>
        <motion.ul className="flex flex-row justify-around flex-wrap">
          {bookList}
        </motion.ul>
      </AnimateSharedLayout>
    </>
  );
};

export default BookList;
