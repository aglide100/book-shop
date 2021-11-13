import React, { useState } from "react";
import { Button } from "../components/Button";
import { InputField, ValidationResult } from "../components/InputField";
import * as axios from "axios";
import { useRouter } from "next/router";

const CreatePage: React.FC<{}> = ({}) => {
  const [bookTitle, setBookTitle] = useState("");
  const [bookTitleErrorMsg, setBookTitleErrorMsg] = useState("");
  const [bookTitleInvalid, setBookTitleInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const [bookAuthor, setBookAuthor] = useState("");
  const [bookAuthorErrorMsg, setBookAuthorErrorMsg] = useState("");
  const [bookAuthorInvalid, setBookAuthorInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const [bookPrice, setBookPrice] = useState<number>(0);
  const [bookPriceErrorMsg, setBookPriceErrorMsg] = useState("");
  const [bookPriceInvalid, setBookPriceInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const [bookQuantity, setBookQuantity] = useState<number>(0);
  const [bookQuantityErrorMsg, setBookQuantityErrorMsg] = useState("");
  const [bookQuantityInvalid, setBookQuantityInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const router = useRouter();

  const onBookTitleHandle = (bookTitle) => {
    if (bookTitle.length < 3) {
      return {
        isInvalid: true,
        errorMessage: "너무 짧습니다.",
      };
    }

    if (bookTitle.length > 64) {
      return {
        isInvalid: true,
        errorMessage: "너무 깁니다.",
      };
    }

    return { isInvalid: false };
  };

  const onBookAuthorHandle = (bookAuthor) => {
    if (bookAuthor.length < 3) {
      return {
        isInvalid: true,
        errorMessage: "너무 짧습니다.",
      };
    }

    if (bookAuthor.length > 64) {
      return {
        isInvalid: true,
        errorMessage: "너무 깁니다.",
      };
    }

    return { isInvalid: false };
  };

  const onBookPriceHandle = (bookPrice) => {
    if (bookPrice == undefined || bookPrice == null) {
      return {
        isInvalid: true,
        errorMessage: "가격을 입력해주십시오.",
      };
    }

    if (bookPrice > 10000000) {
      return {
        isInvalid: true,
        errorMessage: "입력할 수 있는 크기를 초과했습니다.",
      };
    }

    return { isInvalid: false };
  };

  const onBookQuantityHandle = (bookQuantity) => {
    if (bookQuantity == undefined || bookQuantity == null) {
      return {
        isInvalid: true,
        errorMessage: "재고량을 입력해주십시오.",
      };
    }

    if (bookQuantity > 10000000) {
      return {
        isInvalid: true,
        errorMessage: "입력할 수 있는 크기를 초과했습니다.",
      };
    }

    return { isInvalid: false };
  };

  const isItValidForm = (): Boolean => {
    if (bookAuthorInvalid) {
      return false;
    }

    if (bookTitleInvalid) {
      return false;
    }

    if (bookPriceInvalid) {
      return false;
    }

    return true;
  };

  const onSubmitHandle = (event) => {
    console.log("Click Submit handle!");

    const data = JSON.stringify({
      title: bookTitle,
      author: bookAuthor,
      price: bookPrice,
      quantity: bookQuantity,
    });
    const axiosObj = axios.default;

    axiosObj
      .post("http://localhost:4000/api/v1/books", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Successfully posted data!");
        router.push("/");
      })
      .catch((error) => {
        alert("데이터를 전송하지 못했습니다!" + error);
      });
  };

  return (
    <div>
      Hello👋
      <div className="flex flex-col justify-around">
        <div className="mt-3">
          <InputField
            type="text"
            name="title"
            placeholder="책 제목을 입력주세요!"
            label="책 제목"
            isAutocomplete={false}
            validationErrorMsg={bookTitleErrorMsg}
            isInvalid={bookTitleInvalid}
            onChange={(bookTitle) => {
              const { isInvalid, errorMessage } = onBookTitleHandle(bookTitle);
              setBookTitle(bookTitle);
              setBookTitleErrorMsg(errorMessage);
              setBookTitleInvalid(isInvalid);
            }}
          ></InputField>
        </div>
        <div className="mt-3">
          <InputField
            type="text"
            name="author"
            placeholder="저자을 입력주세요!"
            label="저자"
            isAutocomplete={false}
            validationErrorMsg={bookAuthorErrorMsg}
            isInvalid={bookAuthorInvalid}
            onChange={(bookAuthor) => {
              const { isInvalid, errorMessage } =
                onBookAuthorHandle(bookAuthor);
              setBookAuthor(bookAuthor);
              setBookAuthorErrorMsg(errorMessage);
              setBookAuthorInvalid(isInvalid);
            }}
          ></InputField>
        </div>
        <div className="mt-3">
          <InputField
            type="number"
            name="price"
            placeholder="가격을 입력주세요!"
            label="가격"
            isAutocomplete={false}
            validationErrorMsg=""
            isInvalid={false}
            onChange={(bookPrice) => {
              const { isInvalid, errorMessage } = onBookPriceHandle(bookPrice);
              setBookPrice(parseInt(bookPrice));
              setBookPriceErrorMsg(errorMessage);
              setBookPriceInvalid(isInvalid);
            }}
          ></InputField>
        </div>

        <div className="mt-3">
          <InputField
            type="number"
            name="quantity"
            placeholder="재고량을 입력주세요!"
            label="재고량"
            isAutocomplete={false}
            validationErrorMsg=""
            isInvalid={false}
            onChange={(bookQuantity) => {
              const { isInvalid, errorMessage } =
                onBookQuantityHandle(bookQuantity);
              setBookQuantity(parseInt(bookQuantity));
              setBookQuantityErrorMsg(errorMessage);
              setBookQuantityInvalid(isInvalid);
            }}
          ></InputField>
        </div>

        <Button
          size="medium"
          type="button"
          color="white"
          isDisabled={!isItValidForm()}
          onClick={(e) => {
            onSubmitHandle(e);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreatePage;
