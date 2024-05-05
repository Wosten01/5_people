import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_TIMEOUT = +process.env.REACT_APP_DEFAULT_TIMEOUT!;
const url: string = process.env.REACT_APP_BACKEND_API!;

const instance = (timeout = DEFAULT_TIMEOUT) => {
  const requestId = uuidv4();
  console.log(`Create instance with request_id ${requestId}`);

  return axios.create({
    baseURL: url,
    timeout: timeout,
    headers: {
      "x-request-id": requestId,
    },
  });
};

export const loginUser = async (data: { email: string; password: string }) => {
  return await instance().post(`/user/login`, data);
};
export const registerUser = async (data: {
  fullname: string;
  email: string;
  password: string;
}) => {
  return await instance().post(`/user/signup`, data);
};

export const fetchPickers = async () => {
  return await instance().post(`/moder/pickers`);
};

export const confirmReport = async (data: {
  report_id: number;
  value: number;
}) => {
  return await instance().post(`/confirm_report`, data);
};

export const cancelReport = async (data: { report_id: number }) => {
  return await instance().post(`/cancel_report`, data);
};

export const image_link = (img: string) => {
  return `${url}/image?img=${img}`;
};
