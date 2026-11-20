"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const useClarity = () => {
  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
    if (typeof window !== "undefined" && clarityId) {
      Clarity.init(clarityId);
    }
  }, []);
};

export default useClarity;
