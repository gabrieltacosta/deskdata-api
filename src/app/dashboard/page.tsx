import ConsultaForm from "@/components/consulta-form";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await (await cookies()).get("access_token");

  if (!session) {
    redirect("/");
  }

  async function handleLogout() {
    "use server";

    (await cookies()).delete("access_token");
    redirect("/");
  }

  return (
    <div className="container w-full items-center mx-auto p-6 gap-20 flex flex-col min-h-dvh">
      <div className="flex max-w-5xl items-center justify-between">
        <h2 className="font-bold text-3xl">Consulta telefones por CPF.</h2>
        <Button variant={"outline"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="max-w-xl">
        <ConsultaForm />
      </div>
    </div>
  );
};

export default Dashboard;
