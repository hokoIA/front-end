"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHttpErrorMessage } from "@/lib/api/errors";
import { verifyEmailRequest } from "@/lib/api/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type VerifyState = "pending" | "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyState>("pending");
  const [message, setMessage] = useState<string>("");
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    let mounted = true;

    async function runVerification() {
      if (!token) {
        setState("pending");
        return;
      }

      setState("loading");
      try {
        const response = await verifyEmailRequest(token);
        if (!mounted) return;
        setState("success");
        setMessage(response.message || "E-mail confirmado com sucesso.");
      } catch (error) {
        if (!mounted) return;
        setState("error");
        setMessage(getHttpErrorMessage(error));
      }
    }

    runVerification();

    return () => {
      mounted = false;
    };
  }, [token]);

  if (!token) {
    return (
      <Card className="border-hk-border shadow-hk-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl text-hk-deep">Verifique seu e-mail</CardTitle>
          <CardDescription>
            {email
              ? `Enviamos um link de confirmação para ${email}.`
              : "Enviamos um link de confirmação para seu e-mail."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-hk-muted">
            Abra sua caixa de entrada e clique no link para ativar o acesso.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Ir para login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-hk-deep">Confirmação de e-mail</CardTitle>
        <CardDescription>
          {state === "loading"
            ? "Validando seu link de confirmação..."
            : "Conclua a ativação para acessar a plataforma."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state === "loading" && (
          <p className="text-sm text-hk-muted">Isso leva apenas alguns segundos.</p>
        )}
        {state === "success" && (
          <>
            <p className="text-sm text-emerald-700">{message}</p>
            <Button asChild className="w-full">
              <Link href="/login?verified=1">Entrar na conta</Link>
            </Button>
          </>
        )}
        {state === "error" && (
          <>
            <p className="text-sm text-red-600">{message}</p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/register">Voltar ao cadastro</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function VerifyEmailFallback() {
  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardContent className="py-12 text-center text-sm text-hk-muted">
        Carregando...
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
