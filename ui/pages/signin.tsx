import React, { useState } from "react";
import { Button } from "../components/Button";
import { InputField, ValidationResult } from "../components/InputField";
import * as axios from "axios";
import { useRouter } from "next/router";
import { setCookie } from "../utils/cookie";

export const SignInPage: React.FC<{}> = () => {
  const [UserID, setUserID] = useState("");
  const [UserIDErrorMsg, setUserIDErrorMsg] = useState("");
  const [UserIDInvalid, setUserIDInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const [UserPassword, setUserPassword] = useState("");
  const [UserPasswordErrorMsg, setUserPasswordErrorMsg] = useState("");
  const [UserPasswordInvalid, setUserPasswordInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const router = useRouter();

  const onUserIDHandle = (userID) => {
    if (userID.length < 3) {
      return {
        isInvalid: true,
        errorMessage: "너무 짧습니다.",
      };
    }

    if (userID.length > 64) {
      return {
        isInvalid: true,
        errorMessage: "너무 깁니다.",
      };
    }

    return { isInvalid: false };
  };

  const onUserPasswordHandle = (userPassword) => {
    if (userPassword.length < 3) {
      return {
        isInvalid: true,
        errorMessage: "너무 짧습니다.",
      };
    }

    if (userPassword.length > 64) {
      return {
        isInvalid: true,
        errorMessage: "너무 깁니다.",
      };
    }

    return { isInvalid: false };
  };

  const isItValidForm = (): Boolean => {
    if (UserPasswordInvalid) {
      return false;
    }

    if (UserIDInvalid) {
      return false;
    }

    return true;
  };

  const onSubmitHandle = (event) => {
    console.log("Click Submit handle!");

    const data = JSON.stringify({
      member_no: UserID,
      password: UserPassword,
    });
    const axiosObj = axios.default;

    axiosObj
      .post("http://localhost:4000/api/v1/member/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Successfully posted data! get data!" + response);
        setCookie("accessToken", response.data.accessToken);
        setCookie("user", response.data.user);

        document.location.href = "/";
      })
      .catch((error) => {
        alert("데이터를 전송하지 못했습니다!" + error);
      });
  };

  return (
    <div className="flex flex-row justify-center">
      <div>
        <div className="text-4xl">Login</div>
        <div className="flex flex-col justify-around">
          <div className="mt-3">
            <InputField
              type="text"
              name="id"
              placeholder="ID"
              label="ID"
              isAutocomplete={false}
              validationErrorMsg={UserIDErrorMsg}
              isInvalid={UserIDInvalid}
              onChange={(UserID) => {
                const { isInvalid, errorMessage } = onUserIDHandle(UserID);
                setUserID(UserID);
                setUserIDErrorMsg(errorMessage);
                setUserIDInvalid(isInvalid);
              }}
            ></InputField>
          </div>
          <div className="mt-3">
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              label="Password"
              isAutocomplete={false}
              validationErrorMsg={UserPasswordErrorMsg}
              isInvalid={UserPasswordInvalid}
              onChange={(UserPassword) => {
                const { isInvalid, errorMessage } =
                  onUserPasswordHandle(UserPassword);
                setUserPassword(UserPassword);
                setUserPasswordErrorMsg(errorMessage);
                setUserPasswordInvalid(isInvalid);
              }}
            ></InputField>
          </div>
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
          SignIn
        </Button>
        <Button
          size="medium"
          type="button"
          color="white"
          onClick={(e) => {
            e.preventDefault();
            router.push("/signup");
          }}
        >
          SignUp
        </Button>
      </div>
    </div>
  );
};

export default SignInPage;
