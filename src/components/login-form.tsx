"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .email("O email deve ser válido")
    .trim()
    .min(1, "O email é obrigatório"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type LoginFormData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
      credentials: "same-origin",
    });

    if (!res.ok) {
      return form.setError("root", {
        type: "server",
        message: "Falha no login, verifique suas credenciais",
      });
    }

    // Sucesso: cookie httpOnly definido pelo servidor
    console.log("Login bem-sucedido e cookie httpOnly definido");
    // Redireciona para dashboard
    router.push("/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Card className="w-full max-w-sm md:max-w-md p-4">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite seu email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          autoComplete="password"
                        />
                        <Button
                          type="button" // MUITO IMPORTANTE: não submete o formulário
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          {/* 6. Alterna o Ícone */}
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-neutral-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-neutral-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer">
                {form.formState.isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Entrar </p>
                )}
              </Button>
                {form.formState.errors.root && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </p>
                )}
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Criado por{" "}
            <Link href="#" className="underline" target="_blank">
              <span className="dark:text-white/70 cursor-pointer">
                HawkDev.
              </span>
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
