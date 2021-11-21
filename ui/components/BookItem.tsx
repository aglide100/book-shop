import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";
import { Button } from "./Button";
import * as axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from "../utils/cookie";

export type BookProps = {
  id: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
};

const durationRegular = 0.35;
const easeRegular = [0.83, 0, 0.17, 1];

const viewVariants = {
  open: {
    backgroundColor: "rgba(214, 219, 224)",
    // transition: {
    //   type: "spring",
    //   stiffness: 100,
    //   damping: 30,
    // },
  },
  closed: {
    opacity: 0,
    backgroundColor: "rgba(0,0,0,0)",
    // transition: {
    //   type: "spring",
    //   stiffness: 300,
    //   damping: 35,
    // },
  },
};

export const BookItem = (props: BookProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const router = useRouter();

  function requestDeleteBook() {
    const axiosObj = axios.default;
    axiosObj
      .delete("http://localhost:4000/api/v1/books/" + props.id)
      .then((response) => {
        console.log(response);
        document.location.href = "/";
      });
  }

  return (
    <>
      {isSelected && (
        <motion.div
          layout
          layoutId={props.id + "_overlay"}
          className="fixed top-0 left-0 w-screen h-screen bg-black z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          onClick={(ev) => {
            setIsSelected(!isSelected);
          }}
        />
      )}
      <motion.li
        layoutId={props.id + "_view"}
        className={classNames(
          "flex flex-col items-center pb-10 pt-10  top-24 z-20  ",
          {
            "fixed max-w-screen-lg inset-x-1/2": isSelected,
            "": !isSelected,
          }
        )}
      >
        {!isSelected && (
          <>
            <div
              className="flex justify-center w-40 h-10 rounded-lg bg-gray-200"
              onClick={(ev) => {
                setIsSelected(!isSelected);
              }}
            >
              <p>도서제목 : {props.title}</p>
            </div>
          </>
        )}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="z-50 fixed rounded-lg"
              variants={viewVariants}
              // initial={viewVariants.closed}
              animate={viewVariants.open}
              exit={viewVariants.closed}
              onClick={(ev) => {
                ev.preventDefault();
                console.log("Hello!");
              }}
            >
              <motion.div className="px-5 py-5">
                <div className="flex flex-row justify-between">
                  <Button
                    size="medium"
                    type="button"
                    color="gray"
                    isDisabled={false}
                    onClick={(ev) => {
                      ev.preventDefault();
                      setIsSelected(!isSelected);
                    }}
                  >
                    닫기
                  </Button>
                  <div>
                    <Button
                      size="medium"
                      type="button"
                      color="gray"
                      isDisabled={false}
                      onClick={(ev) => {
                        ev.preventDefault();
                        router.push({
                          pathname: "/update",
                          query: props,
                        });
                      }}
                    >
                      수정
                    </Button>
                    <Button
                      size="medium"
                      type="button"
                      color="gray"
                      isDisabled={false}
                      onClick={(ev) => {
                        ev.preventDefault();
                        requestDeleteBook();
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>

                <div className="w-96 flex flex-col justify-around mt-5">
                  <div className="mb-1">도서 제목 : {props.title}</div>
                  <div className="mb-1">도서 저자: {props.author}</div>
                  <div className="mb-1">도서 가격: {props.price}</div>
                  <div className="mb-1">재고량: {props.quantity}</div>
                  <div className="flex flex-row justify-around mt-5">
                    <Button
                      size="medium"
                      type="button"
                      color="purple"
                      isDisabled={false}
                      onClick={(ev) => {
                        ev.preventDefault();
                        // setIsSelected(!isSelected);
                        router.push({
                          pathname: "/order",
                          query: { bookId: props.id, memberId: "" },
                        });
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
                        let ok = false;
                        let quantity;
                        while (!ok) {
                          quantity = prompt("수량을 입력하십시오", "0");
                          if (!isNaN(parseInt(quantity))) {
                            ok = true;
                          }
                        }

                        const axiosObj = axios.default;

                        const data = JSON.stringify({
                          member_no: getCookie("user"),
                          bookId: props.id,
                          quantity: quantity,
                        });

                        axiosObj
                          .post("http://localhost:4000/api/v1/cart/", data, {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          })
                          .then((response) => {});
                      }}
                    >
                      장바구니
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* </motion.div> */}
      </motion.li>
    </>
  );
};
