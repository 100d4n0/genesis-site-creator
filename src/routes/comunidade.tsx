import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { guildSeasonsQuery, rankingsQuery, serverStatusQuery } from "@/lib/queries";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Indicadores da comunidade — WYD Genesis" },
      {
        name: "description",
        content:
          "Indicadores reais da comunidade WYD Genesis: melhores jogadores, guildas em destaque e jogadores online.",
      },
      { property: "og:title", content: "Indicadores da comunidade — WYD Genesis" },
      {
        property: "og:description",
        content: "Melhores jogadores, guildas em destaque e atividade do reino.",
      },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const rankings = useQuery(rankingsQuery);
  const guilds = useQuery(guildSeasonsQuery);
  const status = useQuery(serverStatusQuery);

  const topPlayers = (rankings.data ?? []).filter((r) => r.category === "level").slice(0, 5);
  const topGuilds = (guilds.data ?? []).slice(0, 5);
  const online = (status.data ?? []).reduce((sum, s) => sum + s.players_online, 0);
  const isPending = rankings.isPending || guilds.isPending || status.isPending;

  return (
    <PageShell
      eyebrow="04 · Comunidade"
      title="Indicadores da comunidade"
      description="Rankings reais de jogadores e guildas, atualizados pela equipe."
    >
      {isPending ? <LoadingState /> : null}
      {rankings.error || guilds.error ? (
        <EmptyState>Não foi possível carregar os indicadores agora.</EmptyState>
      ) : null}

      {!isPending ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Jogadores online", value: online },
              { label: "Personagens no ranking", value: (rankings.data ?? []).length },
              { label: "Guildas em temporada", value: topGuilds.length },
            ].map((stat) => (
              <div key={stat.label} className="panel rounded-lg px-6 py-8 text-center">
                <p className="text-runic">{stat.label}</p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-4xl text-primary">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <section className="panel rounded-lg p-6">
              <h2 className="text-xl">Melhores jogadores</h2>
              <div className="gold-rule mt-4" />
              <ul className="mt-4 divide-y divide-border">
                {topPlayers.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <span>
                      <span className="text-primary">{p.position}º</span> {p.character_name}
                      <span className="ml-2 text-sm text-muted-foreground">{p.char_class}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">Nível {p.level}</span>
                  </li>
                ))}
                {topPlayers.length === 0 ? (
                  <li className="py-3 text-sm text-muted-foreground">Sem dados publicados.</li>
                ) : null}
              </ul>
            </section>

            <section className="panel rounded-lg p-6">
              <h2 className="text-xl">Guildas em destaque</h2>
              <div className="gold-rule mt-4" />
              <ul className="mt-4 divide-y divide-border">
                {topGuilds.map((g) => (
                  <li key={g.id} className="flex items-center justify-between py-3">
                    <span>
                      <span className="text-primary">{g.position}º</span> {g.guild_name}
                      <span className="ml-2 text-sm text-muted-foreground">{g.season}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {g.fame.toLocaleString("pt-BR")} fama
                    </span>
                  </li>
                ))}
                {topGuilds.length === 0 ? (
                  <li className="py-3 text-sm text-muted-foreground">Sem dados publicados.</li>
                ) : null}
              </ul>
            </section>
          </div>
        </>
      ) : null}
    </PageShell>
  );
}
