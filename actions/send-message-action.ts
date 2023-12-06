"use server";

import axiosPrivateInstance from "@/axiosInstances/axiosPrivate";
import { AxiosError, AxiosResponse } from "axios";

export type Response = undefined | { error: string; status: number };

type ErrorResponse = {
  detail: string;
  status: number;
};

export const sendTextMessageServer = async (
  user_id: number,
  thread_id: number,
  message: string,
  message_type: string
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axiosPrivateInstance.post(
      "api/chat/message/",
      {
        user_id,
        thread_id,
        message,
        message_type,
      }
    );
  } catch (e) {
    const error = e as AxiosError<ErrorResponse>;
    if (error.response) {
      return {
        error: error.response.data.detail,
        status: error.response.status,
      };
    }
    return { error: "Something went wrong", status: 500 };
  }
};

export const sendFileMessageServer = async (
  formData: FormData
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axiosPrivateInstance.post(
      "api/chat/message/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (e) {
    const error = e as AxiosError<ErrorResponse>;
    if (error.response) {
      return {
        error: error.response.data.detail,
        status: error.response.status,
      };
    }
    return { error: "Something went wrong", status: 500 };
  }
};
