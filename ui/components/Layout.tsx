import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { getCookie, removeCookie } from "../utils/cookie";
import { Router, useRouter } from "next/router";
type Props = {
  children?: ReactNode;
  title?: string;
};

export default function Layout({
  children,
  title = "This is the default title",
}: Props) {
  let header: ReactElement;
  const router = useRouter();

  const [loginMenu, setLoginMenu] = useState<ReactElement>();

  useEffect(() => {
    const token = getCookie("user");
    const accessToken = getCookie("accessToken");
    console.log("token" + token);
    if (token == undefined || token == null || !token || token.length == 0) {
      setLoginMenu(
        <>
          <Link href="/signin">
            <a>Sign In</a>
          </Link>{" "}
          |{" "}
          <Link href="/signup">
            <a>Sign Up</a>
          </Link>
        </>
      );
    } else {
      setLoginMenu(
        <>
          {token} |{" "}
          <span
            onClick={() => {
              removeCookie("user");
              removeCookie("accessToken");

              document.location.href = "/";
            }}
          >
            로그아웃
          </span>{" "}
          |{" "}
          <Link href="/cart">
            <a>장바구니</a>
          </Link>{" "}
          |{" "}
          <Link href="/orderlist">
            <a>주문내역</a>
          </Link>
        </>
      );
    }
  }, []);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{" "}
          |{" "}
          <Link href="/create">
            <a>도서생성</a>
          </Link>{" "}
          | {loginMenu}
        </nav>
      </header>
      {children}
    </div>
  );
}
