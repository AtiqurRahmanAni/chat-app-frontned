"use server";

import axiosPrivateInstance from "@/axiosInstances/axiosPrivate";
import { AxiosError, AxiosResponse } from "axios";

export const testToken = async () => {
  try {
    const response: AxiosResponse = await axiosPrivateInstance.get(
      "/api/user/test-token/"
    );

    const { data } = response.data;
    return true;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      const response: AxiosResponse = error.response;
      return false;
    }
    return true;
  }
};
