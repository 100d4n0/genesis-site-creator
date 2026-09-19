import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { Badge } from "@/components/ui/badge";
import { shopItemsQuery } from "@/lib/queries";

export const Route = createFileRoute("/vitrine")({
  head: () => ({
    meta: [
      { title: "Vitrine especial — WYD Genesis" },
      {
        name: "description",
        content: "Pacotes e itens em destaque publicados pela equipe do WYD Genesis.",
      },
      { property: "og:title", content: "Vitrine especial — WYD Genesis" },
      { property: "og:description", content: "Pacotes e itens em destaque do WYD Genesis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { data, isPending, error } = useQuery(shopItemsQuery);

  return (
    <PageShell
      eyebrow="10 · Loja"
      title="Vitrine especial"
      description="Pacotes reais em destaque, publicados pela equipe."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar a vitrine agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhum item em destaque.</EmptyState> : null}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((item) => (
          <article key={item.id} className="panel rounded-lg p-6">
            {item.featured ? <Badge>Destaque</Badge> : null}
            <h2 className="mt-3 text-xl">{item.name}</h2>
            {item.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            ) : null}
            {item.price_label ? <p className="mt-4 text-primary">{item.price_label}</p> : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
