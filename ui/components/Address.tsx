import React, { useState, useEffect, ReactElement } from "react";
import { AnimateSharedLayout, motion } from "framer-motion";
import * as axios from "axios";

export const Address = () => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  let addressList: ReactElement;

  useEffect(() => {
    if (!isLoaded) {
      fetchBookList();
    }
  });

  function fetchBookList() {
    const axiosObj = axios.default;
    axiosObj.get("http://localhost:4000/api/v1/address").then((response) => {
      setData(response.data);
      console.log(response.data);
      setIsLoaded(true);
    });
  }

  if (data == null || data == undefined || Object.keys(data).length === 0) {
    addressList = (
      <>
        <div>책이 없습니다!</div>
      </>
    );
  } else {
    addressList = data.map((book, index) => {
      return <motion.li></motion.li>;
    });
  }
};
