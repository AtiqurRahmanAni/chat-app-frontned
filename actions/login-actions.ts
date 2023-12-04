"use server";

import axios from "@/axiosInstances/axios";
import { AxiosError, AxiosResponse } from "axios";
import { setCookies } from "@/utils/cookies";
import { encryptData } from "@/utils/encryption";

export const serverLogin = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await axios.post("/api/user/login/", {
      email: email,
      password: password,
    });

    const { data } = response.data;
    const encryptedData = encryptData(data);
    setCookies(encryptedData);
    return {
      data: { id: data.id, email: data.email },
    };
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      const response: AxiosResponse = error.response;
      return {
        error: response.data.detail,
      };
    }
    return { error: "Something went wrong" };
  }
};
