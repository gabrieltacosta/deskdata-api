import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const body = await req.json();
    const { cpf } = body;

    if (!cpf) {
      return NextResponse.json(
        { success: false, error: "CPF is required" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Access token is required" },
        { status: 401 }
      );
    }

    const options = {
      method: "POST",
      url: `${process.env.DESKDATA_URL}/queries`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      data: {
        type: "persons",
        key_type: "cpf",
        datasets: ["phones"],
        key_value: cpf,
      },
    };

    const response = await axios.request(options);
    const data = response.data?.data?.phones?.items || [];
    console.log("Telefones encontrados:", data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Erro ao consultar CPF:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao consultar CPF" },
      { status: 500 }
    );
  }
}
