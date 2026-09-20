import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { Badge } from "@/components/ui/badge";
import { hallOfFameQuery } from "@/lib/queries";
import { Crown, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/hall-da-fama")({
  head: () => ({
    meta: [
      { title: "Hall da Fama — WYD Genesis" },
      {
        name: "description",
        content: "Temporadas confirmadas e vencedores registrados no Hall da Fama do WYD Genesis.",
      },
      { property: "og:title", content: "Hall da Fama — WYD Genesis" },
      { property: "og:description", content: "Temporadas e vencedores do WYD Genesis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HallPage,
});

function HallPage() {
  const { data, isPending, error } = useQuery(hallOfFameQuery);

  return (
    <PageShell
      eyebrow="08 · Honra"
      title="Hall da Fama"
      description="Campeões confirmados por temporada e registros demonstrativos da importação inicial."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar o Hall da Fama agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhuma temporada registrada.</EmptyState> : null}

      <div className="grid gap-5 md:grid-cols-2">
        {(data ?? []).map((entry) => (
          <article key={entry.id} className="panel rounded-lg p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <Crown className="h-7 w-7 text-primary" aria-hidden="true" />
              <Badge variant="outline">{entry.season}</Badge>
            </div>
            <h2 className="mt-3 text-xl">{entry.title}</h2>
            <p className="mt-3 flex items-center gap-2 text-lg text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {entry.winner}
            </p>
            {entry.description ? (
              <p className="mt-3 leading-relaxed text-muted-foreground">{entry.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
