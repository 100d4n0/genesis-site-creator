import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { guildSeasonsQuery } from "@/lib/queries";

export const Route = createFileRoute("/temporada-guildas")({
  head: () => ({
    meta: [
      { title: "Temporada de Guildas — WYD Genesis" },
      {
        name: "description",
        content: "Classificação de fama das guildas por temporada no WYD Genesis.",
      },
      { property: "og:title", content: "Temporada de Guildas — WYD Genesis" },
      { property: "og:description", content: "Fama e classificação das guildas do WYD Genesis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuildSeasonPage,
});

function GuildSeasonPage() {
  const { data, isPending, error } = useQuery(guildSeasonsQuery);

  return (
    <PageShell
      eyebrow="09 · Guildas"
      title="Temporada de Guildas"
      description="Fama real das guildas conforme registros da temporada."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar a temporada agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhuma guilda classificada.</EmptyState> : null}

      <div className="panel overflow-x-auto rounded-lg">
        {data && data.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-runic">#</th>
                <th className="px-4 py-3 text-runic">Guilda</th>
                <th className="px-4 py-3 text-runic">Temporada</th>
                <th className="px-4 py-3 text-runic">Fama</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-primary">{row.position}</td>
                  <td className="px-4 py-3">{row.guild_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.season}</td>
                  <td className="px-4 py-3">{row.fame.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </PageShell>
  );
}
