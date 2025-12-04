import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accessToken = body?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "accessToken is required" },
        { status: 400 }
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
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
