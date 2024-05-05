import axios from "axios";
import * as FileSystem from "expo-file-system";

const DEFAULT_TIMEOUT = 5000_00;
const url: string = process.env.EXPO_PUBLIC_BACKEND_API!;

const instance = (timeout = DEFAULT_TIMEOUT) => {
  return axios.create({
    baseURL: url,
    timeout: timeout,
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

  public async user_pickers(data: { id: number }) {
    return await instance().get(`/user/pickers?id=${data.id}`);
  }

  public async pickers() {
    return await instance().get(`/pickers`);
  }

  public async get_picker(data: { id: string | null }) {
    return await instance().get(`/report/${data.id}`);
  }

  public async top() {
    return await instance().get(`/pickers`);
  }

  public async profile(user_id: number) {
    return await instance().get(`/profile/{${user_id}}`);
  }

  public async send_report(data: {
    img: string;
    text: string;
    geo: string;
    user_id: string;
  }) {
    const formData = new FormData();
    const fileData = await FileSystem.readAsStringAsync(data.img, {
      encoding: FileSystem?.EncodingType?.Base64,
    });
    formData.append("img", fileData);
    formData.append("text", data.text);
    formData.append("geo", data.geo);
    formData.append("user_id", data.user_id);
    // console.log(formData);
    let r = await instance().postForm(`/report/base64`, formData);
  }

  public async user_confirm(data: { img: string; report_id: string }) {
    const formData = new FormData();
    const fileData = await FileSystem.readAsStringAsync(data.img, {
      encoding: FileSystem?.EncodingType?.Base64,
    });
    formData.append("img", fileData);
    formData.append("report_id", data.report_id);
    await instance().postForm(`/user_confirm/base64`, formData);
  }

  public static image_link = (img: string) => {
    return `${url}/image?img=${img}`;
  };
}
