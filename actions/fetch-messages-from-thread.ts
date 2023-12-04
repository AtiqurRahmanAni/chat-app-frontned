"use server";

import axiosPrivateInstance from "@/axiosInstances/axiosPrivate";
import { AxiosError, AxiosResponse } from "axios";
import { Message } from "@/types";

type Response = Message[] | { error: string };

export const fetchMessageFromThread = async (
  thread_id: number
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axiosPrivateInstance.get(
      "api/chat/message/",
      { params: { thread_id } }
    );
    const { data } = response.data;
    return data;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) {
      return { error: "Error fetching thread" };
    }
    return { error: "Something went wrong" };
  }
};
