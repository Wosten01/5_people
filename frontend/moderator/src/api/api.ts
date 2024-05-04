import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_TIMEOUT = 1000;

const instance = (timeout = DEFAULT_TIMEOUT) => {
  const requestId = uuidv4();
  console.log(`Create instance with request_id ${requestId}`);

  const url: string = process.env.REACT_APP_SUPERVISOR_URL!;
  return axios.create({
    baseURL: url,
    timeout: timeout,
    headers: {
      "x-request-id": requestId,
    },
    withCredentials: true,
  });
};

export class API {
  private static instance: API;

  private constructor() {}

  public static getInstance(): API {
    if (!API.instance) {
      API.instance = new API();
    }

    return API.instance;
  }

  public async login(data: { email: string; password: string }) {
    return await instance().post(`/user/login`, data);
  }
  public async register(data: {
    fullname: string;
    email: string;
    password: string;
  }) {
    return await instance().post(`/user/signup`, data);
  }
}
