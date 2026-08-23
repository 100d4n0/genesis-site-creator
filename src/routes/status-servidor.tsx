import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { serverStatusQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/status-servidor")({
  head: () => ({
    meta: [
      { title: "Status do servidor — WYD Genesis" },
      {
        name: "description",
        content:
          "Status público dos servidores do WYD Genesis: jogadores online, manutenções e avisos oficiais.",
      },
      { property: "og:title", content: "Status do servidor — WYD Genesis" },
      {
        property: "og:description",
        content: "Jogadores online, manutenções e avisos oficiais do WYD Genesis.",
      },
    ],
  }),
  component: StatusPage,
});

const STATE_LABEL: Record<string, string> = {
  online: "Online",
  manutencao: "Em manutenção",
  offline: "Offline",
};

function StatusPage() {
  const { data, isPending, error } = useQuery(serverStatusQuery);
  const total = (data ?? []).reduce((sum, s) => sum + s.players_online, 0);

  return (
    <PageShell
      eyebrow="02 · Servidor"
      title="Status do servidor"
      description="Acompanhe manutenções e avisos públicos do reino."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível consultar o status agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhum servidor cadastrado.</EmptyState> : null}

      {data && data.length > 0 ? (
        <>
          <div className="panel mb-8 rounded-lg px-6 py-8 text-center">
            <p className="text-runic">Jogadores online</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-5xl text-primary">
              {total}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.map((s) => (
              <div key={s.id} className="panel rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg">{s.server_name}</h2>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase",
                      s.state === "online" ? "text-online" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        s.state === "online" ? "bg-online" : "bg-crimson",
                      )}
                    />
                    {STATE_LABEL[s.state] ?? s.state}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{s.players_online} online</p>
                {s.message ? <p className="mt-3 text-sm">{s.message}</p> : null}
                <p className="mt-4 text-xs text-muted-foreground">
                  Atualizado em{" "}
                  {new Date(s.updated_at).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </PageShell>
  );
}
