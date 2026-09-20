import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { Badge } from "@/components/ui/badge";
import { shopItemsQuery } from "@/lib/queries";
import { Coins, PackageOpen, Sparkles } from "lucide-react";

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
      description="Pacotes importados do catálogo oficial, com valores e conteúdos organizados para comparação."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar a vitrine agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhum item em destaque.</EmptyState> : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="panel rounded-lg p-5">
          <PackageOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-2xl text-primary">{data?.length ?? 0}</p>
          <p className="text-sm text-muted-foreground">pacotes disponíveis</p>
        </div>
        <div className="panel rounded-lg p-5">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-2xl text-primary">{data?.filter((item) => item.featured).length ?? 0}</p>
          <p className="text-sm text-muted-foreground">ofertas em destaque</p>
        </div>
        <div className="panel rounded-lg p-5">
          <Coins className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-2xl text-primary">Catálogo oficial</p>
          <p className="text-sm text-muted-foreground">valores do dump enviado</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((item) => (
          <article key={item.id} className="panel flex min-h-56 flex-col rounded-lg p-6">
            <div className="flex items-center justify-between gap-3">
              <PackageOpen className="h-6 w-6 text-primary" aria-hidden="true" />
              {item.featured ? <Badge>Destaque</Badge> : null}
            </div>
            <h2 className="mt-3 text-xl">{item.name}</h2>
            {item.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            ) : null}
            {item.price_label ? (
              <p className="mt-auto pt-5 text-xl text-primary">{item.price_label}</p>
            ) : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
