import axiosClient from "./axios.client";

export const chatCompletion = async ({ prompt,Type }) => {
  try {
    const response = await axiosClient.post("chats", { prompt,Type });

    return { response };
  } catch (err) {
    return { err };
  }
};