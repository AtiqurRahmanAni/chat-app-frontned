"use server";

import axios from "@/axiosInstances/axios";
import { AxiosError, AxiosResponse } from "axios";
import { decryptData } from "@/utils/encryption";
import { getLoggedInInfo } from "@/utils/cookies";
import { deleteCookies } from "@/utils/cookies";

interface UserInfo {
  id: number;
  email: string;
}

interface UserError {
  error: string;
}
type GetUserResponse = { data?: UserInfo } | UserError;

export const getUserInfoOnRefresh = async (): Promise<GetUserResponse> => {
  const parsedToken = decryptData(getLoggedInInfo());

  if (!parsedToken) {
    return { error: "Session expired, Login in again" };
  }

  try {
    const response: AxiosResponse = await axios.post("/api/token/verify/", {
      token: parsedToken.tokens.refresh,
    });

    return { data: { id: parsedToken.id, email: parsedToken.email } };
  } catch (e) {
    const error = e as AxiosError;
    if (!error.response) {
      return {
        data: { id: parsedToken.id, email: parsedToken.email },
      };
    }
    deleteCookies();
    return { error: "Session expired, login again" };
  }
};
