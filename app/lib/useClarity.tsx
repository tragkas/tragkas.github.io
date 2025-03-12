"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const useClarity = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      Clarity.init("qm4eaik97r");
    }
  }, []);
};

export default useClarity;
