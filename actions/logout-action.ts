"use server";

import axios from "@/axiosInstances/axios";
import { deleteCookies } from "@/utils/cookies";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { decryptData } from "@/utils/encryption";
import { getLoggedInInfo } from "@/utils/cookies";

export const serverLogout = async (): Promise<boolean> => {
  try {
    const refresh = decryptData(getLoggedInInfo())?.tokens.refresh;
    const response = await axios.post("/api/user/logout/", {
      refresh,
    });
    deleteCookies();
    return true;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        deleteCookies();
        return true;
      }
    }
    return false;
  }
};
