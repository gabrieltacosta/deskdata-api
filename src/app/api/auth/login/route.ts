import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "email and password are required" },
        { status: 400 }
      );
    }

    const options = {
      method: "POST",
      url: `${process.env.DESKDATA_URL}/auth`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      data: { username: email, password: password, expires_in: 1 },
    };

    const response = await axios.request(options);
    const accessToken = response.data?.data.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No access token returned" },
        { status: 401 }
      );
    }

    const maxAge = 60 * 60 * 24; // 1 day in seconds
    const secure = process.env.NODE_ENV === "production";

    const cookie = `access_token=${accessToken}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${
      secure ? "; Secure" : ""
    }`;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
