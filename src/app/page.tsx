import LoginForm from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await (await cookies()).get("access_token");

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto min-h-dvh flex flex-col justify-center items-center p-4">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-xl md:text-3xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-sm text-center">
          This is the main landing page of the application.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
