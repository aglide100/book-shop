import React, { useState } from "react";
import { Button } from "../components/Button";
import { InputField, ValidationResult } from "../components/InputField";
import * as axios from "axios";
import { useRouter } from "next/router";

export const SignUpPage: React.FC<{}> = () => {
  const [UserID, setUserID] = useState("");
  const [UserIDErrorMsg, setUserIDErrorMsg] = useState("");
  const [UserIDInvalid, setUserIDInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const [UserPassword, setUserPassword] = useState("");
  const [UserPasswordErrorMsg, setUserPasswordErrorMsg] = useState("");
  const [UserPasswordInvalid, setUserPasswordInvalid] =
    useState<ValidationResult["isInvalid"]>("none");

  const [UserName, setUserName] = useState<string>("");
  const [UserNameErrorMsg, setUserNameErrorMsg] = useState("");
  const [UserNameInvalid, setUserNameInvalid] =
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

  const onUserNameHandle = (UserName) => {
    if (UserName == undefined || UserName == null) {
      return {
        isInvalid: true,
        errorMessage: "이름을 입력해주십시오.",
      };
    }

    if (UserName.length > 15) {
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

    if (UserNameInvalid) {
      return false;
    }

    return true;
  };

  const onSubmitHandle = (event) => {
    const data = JSON.stringify({
      member_no: UserID,
      password: UserPassword,
      name: UserName,
    });
    const axiosObj = axios.default;

    axiosObj
      .post("http://localhost:4000/api/v1/member/join", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Successfully posted data! get data!" + response);
        alert("회원가입에 성공하였습니다.");
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
        <div className="mt-3">
          <InputField
            type="text"
            name="text"
            placeholder="이름"
            label="이름"
            isAutocomplete={false}
            validationErrorMsg={UserNameErrorMsg}
            isInvalid={false}
            onChange={(UserName) => {
              const { isInvalid, errorMessage } = onUserNameHandle(UserName);
              setUserName(UserName);
              setUserNameErrorMsg(errorMessage);
              setUserNameInvalid(isInvalid);
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
        Submit
      </Button>
    </div>
  );
};

export default SignUpPage;
