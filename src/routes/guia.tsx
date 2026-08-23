import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { guideSectionsQuery } from "@/lib/queries";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Regras e guia do jogador — WYD Genesis" },
      {
        name: "description",
        content:
          "Guia oficial do WYD Genesis: primeiros passos, regras do reino, segurança da conta e sistemas de jogo.",
      },
      { property: "og:title", content: "Regras e guia do jogador — WYD Genesis" },
      {
        property: "og:description",
        content: "Primeiros passos, regras, segurança e sistemas do WYD Genesis.",
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { data, isPending, error } = useQuery(guideSectionsQuery);

  return (
    <PageShell
      eyebrow="03 · Guia"
      title="Regras e guia"
      description="Segurança da conta, regras do reino e orientações oficiais da equipe."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar o guia agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhuma seção publicada.</EmptyState> : null}

      <div className="grid gap-5 md:grid-cols-2">
        {(data ?? []).map((section) => (
          <section key={section.id} className="panel rounded-lg p-6 md:p-8">
            <p className="text-runic">{section.category}</p>
            <h2 className="mt-3 text-xl">{section.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
