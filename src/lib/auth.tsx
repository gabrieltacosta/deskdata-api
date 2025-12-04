"use server";

import axios from "axios";

interface SignInParams {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: SignInParams) => {
  const options = {
    method: "POST",
    url: `${process.env.DESKDATA_URL}/auth`,
    headers: { accept: "application/json", "content-type": "application/json" },
    data: { username: email, password: password, expires_in: 1 },
  };

  try {
    const response = await axios.request(options);
    const accessToken = response.data?.access_token;
    if (accessToken) {
      return { success: true, accessToken };
    }
    return { success: false, error: "Nenhum token recebido" };
  } catch {
    return { success: false, error: "Falha no login" };
  }
};
