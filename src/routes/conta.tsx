import { createFileRoute, Link } from "@tanstack/react-router";

import { EmptyState, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — WYD Genesis" },
      {
        name: "description",
        content: "Área da conta do jogador no portal oficial do WYD Genesis.",
      },
      { property: "og:title", content: "Minha conta — WYD Genesis" },
      { property: "og:description", content: "Área da conta do jogador no WYD Genesis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, isAdmin, signOut } = useAuth();

  return (
    <PageShell eyebrow="Conta" title="Minha conta" description="Seus dados de acesso ao reino.">
      {loading ? <EmptyState>Carregando sua sessão…</EmptyState> : null}

      {!loading && !user ? (
        <div className="panel mx-auto max-w-md rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Você precisa entrar para ver esta página.</p>
          <Button asChild className="mt-6">
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      ) : null}

      {user ? (
        <div className="panel mx-auto max-w-md rounded-lg p-6 md:p-8">
          <p className="text-runic">E-mail</p>
          <p className="mt-2">{user.email}</p>
          <div className="gold-rule my-6 w-full" />
          <p className="text-runic">Papel</p>
          <p className="mt-2">{isAdmin ? "Administrador" : "Jogador"}</p>
          <div className="mt-8 flex gap-3">
            {isAdmin ? (
              <Button asChild variant="outline">
                <Link to="/admin">Painel admin</Link>
              </Button>
            ) : null}
            <Button variant="ghost" onClick={() => void signOut()}>
              Sair
            </Button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
