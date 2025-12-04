"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle, Phone, Smartphone, Loader2 } from "lucide-react";

interface PhoneItem {
  country_code: string;
  area_code: string;
  number: string;
  type: string;
  carrier: string;
  is_main: boolean;
  priority: number;
  first_seen_date: string;
  last_seen_date: string;
}

const formSchema = z.object({
  cpf: z
    .string()
    .trim()
    .min(11, "O CPF deve ter 11 dígitos")
    .max(11, "O CPF deve ter 11 dígitos"),
});

type ConsultaFormData = z.infer<typeof formSchema>;

const ConsultaForm = () => {
  const [phones, setPhones] = useState<PhoneItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCpf, setSearchedCpf] = useState<string | null>(null);

  const form = useForm<ConsultaFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ConsultaFormData) => {
    setLoading(true);
    setError(null);
    setPhones([]);

    try {
      const res = await fetch("/api/cpf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: data.cpf }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorMsg = body?.error || "Falha na consulta";
        setError(errorMsg);
        console.error("Consulta falhou:", errorMsg);
        return;
      }

      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setPhones(result.data);
        setSearchedCpf(data.cpf);
      } else {
        setError("Nenhum telefone encontrado para este CPF");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro na requisição";
      setError(errorMsg);
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <Card className="rounded-lg">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-xl md:text-2xl">
            Consultar Telefones
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Digite um CPF para buscar os telefones cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o CPF (11 dígitos)"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  "Consultar"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {phones.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold break-all">
              Telefones para CPF {searchedCpf}
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Total: {phones.length} telefone(s)
            </p>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {phones.map((phone, index) => (
              <Card
                key={index}
                className={phone.is_main ? "border-blue-500 border-2" : ""}
              >
                <CardHeader className="pb-2 md:pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-sm md:text-base flex items-center gap-2">
                      <Smartphone className="h-4 w-4 shrink-0" />
                      <span className="truncate">{phone.type === "WORK"
                          ? "Trabalho"
                          : phone.type === "MOBILE"
                          ? "Celular"
                          : phone.type === "HOME"
                          ? "Residencial"
                          : phone.type === "OTHER"
                          ? "Outro"
                          : phone.type}</span>
                    </CardTitle>
                    {phone.is_main && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded w-fit">
                        Principal
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                      <p className="text-xs md:text-sm font-mono break-all">
                        ({phone.area_code}) {phone.number}
                      </p>
                    </div>
                    <div className="text-xs md:text-sm space-y-1">
                      <p>
                        <span className="text-gray-600 font-medium">
                          Operadora:
                        </span>{" "}
                        {phone.carrier}
                      </p>
                      <p>
                        <span className="text-gray-600 font-medium">País:</span>{" "}
                        +{phone.country_code}
                      </p>
                      <p>
                        <span className="text-gray-600 font-medium">
                          Prioridade:
                        </span>{" "}
                        {phone.priority}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t text-xs text-gray-500 space-y-0.5">
                    <p className="truncate">
                      Primeiro:{" "}
                      {new Date(phone.first_seen_date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                    <p className="truncate">
                      Último:{" "}
                      {new Date(phone.last_seen_date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaForm;
