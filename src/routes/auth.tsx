import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "entrar" | "registrar";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: AuthMode } => ({
    mode: search['mode'] === "registrar" ? "registrar" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — WYD Genesis" },
      {
        name: "description",
        content:
          "Acesse sua conta do WYD Genesis ou registre-se para acompanhar rankings, eventos e comunicados do reino.",
      },
      { property: "og:title", content: "Entrar ou criar conta — WYD Genesis" },
      {
        property: "og:description",
        content: "Acesse ou crie sua conta no portal oficial do WYD Genesis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(mode === "registrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta ao reino.");
        void navigate({ to: "/conta" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      eyebrow={isRegister ? "Registro" : "Acesso"}
      title={isRegister ? "Criar conta" : "Entrar"}
      description="Use seu e-mail para acessar o portal do reino."
    >
      <form onSubmit={handleSubmit} className="panel mx-auto max-w-md rounded-lg p-6 md:p-8">
        {isRegister ? (
          <div className="mb-4">
            <Label htmlFor="displayName">Nome de exibição</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2"
              autoComplete="nickname"
            />
          </div>
        ) : null}

        <div className="mb-4">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Aguarde…" : isRegister ? "Criar conta" : "Entrar"}
        </Button>

        <button
          type="button"
          onClick={() => setIsRegister((v) => !v)}
          className="mt-5 w-full text-sm text-primary"
        >
          {isRegister ? "Já tenho conta — entrar" : "Não tenho conta — registrar"}
        </button>
      </form>
    </PageShell>
  );
}
