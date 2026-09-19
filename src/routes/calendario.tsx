import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, LoadingState, PageShell } from "@/components/site/PageShell";
import { Badge } from "@/components/ui/badge";
import { eventsQuery } from "@/lib/queries";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário de eventos — WYD Genesis" },
      {
        name: "description",
        content:
          "Agenda oficial do WYD Genesis: guerras, invasões, manutenções e eventos publicados pela equipe.",
      },
      { property: "og:title", content: "Calendário de eventos — WYD Genesis" },
      {
        property: "og:description",
        content: "Guerras, invasões e eventos agendados do reino WYD Genesis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CalendarPage() {
  const { data, isPending, error } = useQuery(eventsQuery);

  return (
    <PageShell
      eyebrow="07 · Eventos"
      title="Calendário"
      description="Agenda real de eventos publicada pela equipe do reino."
    >
      {isPending ? <LoadingState /> : null}
      {error ? <EmptyState>Não foi possível carregar a agenda agora.</EmptyState> : null}
      {data && data.length === 0 ? <EmptyState>Nenhum evento agendado.</EmptyState> : null}

      <div className="grid gap-4">
        {(data ?? []).map((event) => (
          <article key={event.id} className="panel rounded-lg p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {event.event_type}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(event.starts_at)}</span>
              {event.ends_at ? (
                <span className="text-xs text-muted-foreground">até {formatDate(event.ends_at)}</span>
              ) : null}
            </div>
            <h2 className="mt-4 text-xl">{event.title}</h2>
            {event.description ? (
              <p className="mt-2 leading-relaxed text-muted-foreground">{event.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
