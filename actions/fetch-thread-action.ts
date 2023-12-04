"use server";

import axiosPrivateInstance from "@/axiosInstances/axiosPrivate";
import { AxiosError, AxiosResponse } from "axios";
import { ThreadParticipant } from "@/types";

type Response = ThreadParticipant[] | { error: string };

export const fetchThread = async (): Promise<Response> => {
  try {
    const response: AxiosResponse = await axiosPrivateInstance.get(
      "/api/chat/thread/"
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
