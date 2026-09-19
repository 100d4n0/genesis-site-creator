import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  eventsQuery,
  guideSectionsQuery,
  newsQuery,
  rankingsQuery,
  serverStatusQuery,
  shopItemsQuery,
} from "@/lib/queries";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — WYD Genesis" },
      {
        name: "description",
        content: "Painel interno da equipe do WYD Genesis para acompanhar o conteúdo publicado.",
      },
      { property: "og:title", content: "Painel administrativo — WYD Genesis" },
      { property: "og:description", content: "Painel interno da equipe do WYD Genesis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const enabled = isAdmin;

  const news = useQuery({ ...newsQuery, enabled });
  const events = useQuery({ ...eventsQuery, enabled });
  const status = useQuery({ ...serverStatusQuery, enabled });
  const rankings = useQuery({ ...rankingsQuery, enabled });
  const shop = useQuery({ ...shopItemsQuery, enabled });
  const guide = useQuery({ ...guideSectionsQuery, enabled });

  if (loading) {
    return (
      <PageShell eyebrow="Admin" title="Painel">
        <EmptyState>Verificando permissões…</EmptyState>
      </PageShell>
    );
  }

  if (!user || !isAdmin) {
    return (
      <PageShell eyebrow="Admin" title="Acesso restrito">
        <div className="panel mx-auto max-w-md rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Esta área é exclusiva da equipe administrativa do reino.
          </p>
          <Button asChild className="mt-6">
            <Link to={user ? "/" : "/auth"}>{user ? "Voltar ao início" : "Entrar"}</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const cards = [
    { label: "Notícias", count: news.data?.length, to: "/noticias-eventos" as const },
    { label: "Eventos", count: events.data?.length, to: "/calendario" as const },
    { label: "Servidores", count: status.data?.length, to: "/status-servidor" as const },
    { label: "Rankings", count: rankings.data?.length, to: "/ranking" as const },
    { label: "Vitrine", count: shop.data?.length, to: "/vitrine" as const },
    { label: "Guia", count: guide.data?.length, to: "/guia" as const },
  ];

  return (
    <PageShell
      eyebrow="Admin"
      title="Painel administrativo"
      description="Resumo do conteúdo publicado no portal."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="panel rounded-lg p-6 transition-colors hover:border-primary/60"
          >
            <p className="text-runic">{card.label}</p>
            <p className="mt-3 text-3xl text-primary">{card.count ?? "—"}</p>
            <p className="mt-2 text-sm text-muted-foreground">registros publicados</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
