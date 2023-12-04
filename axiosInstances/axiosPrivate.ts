import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { deleteCookies, setCookies } from "@/utils/cookies";
import { encryptData, decryptData } from "@/utils/encryption";
import { getLoggedInInfo } from "@/utils/cookies";

const axiosPrivateInstance: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true, // Important for sending cookies
});

axiosPrivateInstance.interceptors.request.use(
  (config) => {
    // console.log("Request interceptor");
    const accessToken = decryptData(getLoggedInInfo())?.tokens.access;
    if (!config.headers["Authorization"] && accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // console.log("Request interceptor error");
    return Promise.reject(error);
  }
);

axiosPrivateInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("Response interceptor");
    return response;
  },
  async (error) => {
    // console.log("Response interceptor error");
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const decryptedToken = decryptData(getLoggedInInfo());
      let refresh = decryptedToken?.tokens.refresh;
      const userInfo = {
        id: decryptedToken?.id as number,
        email: decryptedToken?.email as string,
      };

      try {
        const response = await axios.post(
          `${process.env.API_URL}/api/token/refresh/`,
          {
            refresh,
          }
        );

        if (response.status === 200) {
          const { access, refresh } = response.data;

          const encryptedData = encryptData({
            ...userInfo,
            tokens: { access, refresh },
          });
          setCookies(encryptedData);

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosPrivateInstance(originalRequest);
        }
      } catch (e) {
        const error = e as AxiosError;
        if (error.response?.status === 401) {
          deleteCookies();
        }
      }
    }
    // console.log("Response interceptor error again");
    return Promise.reject(error);
  }
);

export default axiosPrivateInstance;
