import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rankingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking ingame — WYD Genesis" },
      {
        name: "description",
        content:
          "Ranking oficial do WYD Genesis por nível, PK e fama de guilda, atualizado pela equipe do servidor.",
      },
      { property: "og:title", content: "Ranking ingame — WYD Genesis" },
      {
        property: "og:description",
        content: "Ranking por nível, PK e fama de guilda do WYD Genesis.",
      },
    ],
  }),
  component: RankingPage,
});

const CATEGORIES = [
  { key: "level", label: "Nível" },
  { key: "pk", label: "PK" },
  { key: "fama", label: "Fama de guilda" },
] as const;

function RankingPage() {
  const { data, isPending, error } = useQuery(rankingsQuery);
  const [tab, setTab] = useState<string>("level");

  return (
    <PageShell
      eyebrow="05 · Ranking"
      title="Ranking Ingame"
      description="Acompanhe a disputa pelo topo do reino."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar o ranking agora.</EmptyState> : null}

      {data ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mx-auto flex w-full max-w-md">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.key} value={c.key} className="flex-1">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((c) => {
            const rows = data.filter((r) => r.category === c.key);
            return (
              <TabsContent key={c.key} value={c.key} className="mt-8">
                {rows.length === 0 ? (
                  <EmptyState>Nenhum registro publicado nesta categoria.</EmptyState>
                ) : (
                  <div className="panel overflow-x-auto rounded-lg">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-runic">
                          <th className="px-5 py-4">#</th>
                          <th className="px-5 py-4">{c.key === "fama" ? "Guilda" : "Personagem"}</th>
                          {c.key !== "fama" ? <th className="px-5 py-4">Classe</th> : null}
                          {c.key !== "fama" ? <th className="px-5 py-4">Nível</th> : null}
                          {c.key !== "fama" ? <th className="px-5 py-4">Guilda</th> : null}
                          <th className="px-5 py-4">Pontos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.id} className="border-b border-border/60 last:border-0">
                            <td className="px-5 py-4 text-primary">{r.position}</td>
                            <td className="px-5 py-4">{r.character_name}</td>
                            {c.key !== "fama" ? (
                              <td className="px-5 py-4 text-muted-foreground">{r.char_class}</td>
                            ) : null}
                            {c.key !== "fama" ? <td className="px-5 py-4">{r.level}</td> : null}
                            {c.key !== "fama" ? (
                              <td className="px-5 py-4 text-muted-foreground">{r.guild}</td>
                            ) : null}
                            <td className="px-5 py-4">{r.score.toLocaleString("pt-BR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      ) : null}
    </PageShell>
  );
}
