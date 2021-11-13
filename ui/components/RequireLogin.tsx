import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";
type RequireLoginProps = {
  children: ReactNode;
};

export default function RequireLogin({ children }: RequireLoginProps) {
  const router = useRouter();
  const token = getCookie("accessToken");
  useEffect(() => {
    if (!token) {
      console.log("Can't get token" + router.pathname);
      if (router.pathname != "/signin") {
        if (router.pathname != "/signup") {
          router.push("/signin");
        }
      }
    }
  });

  return <>{children}</>;
}
