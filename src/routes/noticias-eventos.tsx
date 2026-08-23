import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { Badge } from "@/components/ui/badge";
import { newsQuery } from "@/lib/queries";

export const Route = createFileRoute("/noticias-eventos")({
  head: () => ({
    meta: [
      { title: "Notícias e eventos — WYD Genesis" },
      {
        name: "description",
        content: "Comunicados, notícias e agenda oficial publicados pela equipe do WYD Genesis.",
      },
      { property: "og:title", content: "Notícias e eventos — WYD Genesis" },
      {
        property: "og:description",
        content: "Comunicados e agenda oficial do reino WYD Genesis.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data, isPending, error } = useQuery(newsQuery);

  return (
    <PageShell
      eyebrow="01 · Comunidade"
      title="Notícias e eventos"
      description="Comunicados e agenda publicados pela equipe do reino."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar as notícias agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhum comunicado publicado.</EmptyState> : null}

      <div className="grid gap-6">
        {(data ?? []).map((item) => (
          <article key={item.id} className="panel rounded-lg p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {item.category}
              </Badge>
              {item.featured ? <Badge>Destaque</Badge> : null}
              <span className="text-xs text-muted-foreground">
                {new Date(item.published_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h2 className="mt-4 text-2xl">{item.title}</h2>
            {item.excerpt ? <p className="mt-2 text-muted-foreground">{item.excerpt}</p> : null}
            {item.body ? <p className="mt-4 leading-relaxed">{item.body}</p> : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
