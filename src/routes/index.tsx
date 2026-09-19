import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import crest from "@/assets/crest.png";
import heroWar from "@/assets/hero-war.jpg";
import cardWar from "@/assets/card-war.jpg";
import cardGuild from "@/assets/card-guild.jpg";
import cardTreasure from "@/assets/card-treasure.jpg";
import { Button } from "@/components/ui/button";
import { DOWNLOAD_URL, newsQuery, serverStatusQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WYD Genesis — Portal oficial do reino" },
      {
        name: "description",
        content:
          "Portal oficial do WYD Genesis: baixe o jogo, crie sua conta, acompanhe status do servidor, rankings, eventos e regras do reino.",
      },
      { property: "og:title", content: "WYD Genesis — Portal oficial do reino" },
      {
        property: "og:description",
        content:
          "Baixe o jogo, crie sua conta e acompanhe rankings, eventos e status do servidor do WYD Genesis.",
      },
    ],
  }),
  component: Index,
});

const SYSTEMS = [
  {
    n: "01",
    tag: "Comunidade",
    title: "Notícias e eventos",
    text: "Todos os comunicados oficiais da equipe, do mais recente ao mais antigo.",
    to: "/noticias-eventos" as const,
    img: cardWar,
  },
  {
    n: "02",
    tag: "Servidor",
    title: "Status do servidor",
    text: "Veja se o servidor está online, quantos jogadores há e quando haverá manutenção.",
    to: "/status-servidor" as const,
    img: cardGuild,
  },
  {
    n: "03",
    tag: "Guia",
    title: "Regras e guia",
    text: "As regras do reino e como proteger sua conta contra perdas e invasões.",
    to: "/guia" as const,
    img: cardTreasure,
  },
  {
    n: "04",
    tag: "Comunidade",
    title: "Indicadores da comunidade",
    text: "Números gerais do reino: jogadores ativos, guildas e destaques da temporada.",
    to: "/comunidade" as const,
    img: cardWar,
  },
  {
    n: "05",
    tag: "Ranking",
    title: "Ranking dos jogadores",
    text: "Quem lidera o reino em nível e poder, atualizado pela equipe.",
    to: "/ranking" as const,
    img: cardTreasure,
  },
  {
    n: "06",
    tag: "Início",
    title: "Comece agora",
    text: "Quatro passos para baixar o jogo, criar sua conta e entrar no reino.",
    to: "/comece-agora" as const,
    img: cardGuild,
  },
  {
    n: "07",
    tag: "Eventos",
    title: "Calendário",
    text: "Datas e horários de guerras, invasões e eventos marcados.",
    to: "/calendario" as const,
    img: cardWar,
  },
  {
    n: "08",
    tag: "Honra",
    title: "Hall da Fama",
    text: "Os vencedores de cada temporada já encerrada.",
    to: "/hall-da-fama" as const,
    img: cardGuild,
  },
  {
    n: "09",
    tag: "Guildas",
    title: "Temporada de Guildas",
    text: "A classificação de fama das guildas na temporada atual.",
    to: "/temporada-guildas" as const,
    img: cardGuild,
  },
  {
    n: "10",
    tag: "Loja",
    title: "Vitrine especial",
    text: "Os pacotes e itens em destaque no momento.",
    to: "/vitrine" as const,
    img: cardTreasure,
  },
];

function Index() {
  const status = useQuery(serverStatusQuery);
  const news = useQuery(newsQuery);
  const online = (status.data ?? []).reduce((sum, s) => sum + s.players_online, 0);

  return (
    <main>
      <section className="relative overflow-hidden">
        <img
          src={heroWar}
          alt="Exército medieval diante de um castelo em chamas"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center md:py-32">
          <p className="text-runic">◈ ⚔ ♜ ⌖ ♛ ✦</p>
          <img
            src={crest}
            alt="Brasão do reino WYD Genesis"
            width={1024}
            height={1024}
            className="mt-6 h-32 w-32 md:h-44 md:w-44"
          />
          <h1 className="mt-6 text-4xl tracking-[0.14em] md:text-6xl">WYD GENESIS</h1>
          <div className="gold-rule mt-6 w-56" />
          <p className="mt-6 text-lg text-muted-foreground">Portal oficial do reino</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={DOWNLOAD_URL} target="_blank" rel="noreferrer noopener">
                Baixar o jogo ↓
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth" search={{ mode: "registrar" }}>
                Criar conta
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {status.isPending ? "Consultando o reino…" : `${online} guerreiros em batalha agora`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "◉", label: "Servidor", sub: "Status público", to: "/status-servidor" as const },
            { icon: "⚔", label: "Eventos", sub: "Agenda oficial", to: "/calendario" as const },
            { icon: "♜", label: "Guia", sub: "Sistemas e regras", to: "/guia" as const },
            { icon: "◈", label: "Comunidade", sub: "Rankings reais", to: "/comunidade" as const },
          ].map((q) => (
            <Link
              key={q.label}
              to={q.to}
              className="panel group rounded-lg px-6 py-7 text-center transition-colors hover:border-primary/60"
            >
              <span className="text-2xl text-primary">{q.icon}</span>
              <p className="mt-3 font-[family-name:var(--font-display)] tracking-[0.18em] uppercase">
                {q.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{q.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="text-center">
          <p className="text-runic">Sistemas</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Sistemas do WYD Genesis</h2>
          <div className="gold-rule mx-auto mt-6 w-40" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((s) => (
            <Link
              key={s.n}
              to={s.to}
              className="panel group overflow-hidden rounded-lg transition-colors hover:border-primary/60"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/45" />
              </div>
              <div className="p-6">
                <p className="text-runic">
                  {s.n} · {s.tag}
                </p>
                <h3 className="mt-3 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                <span className="mt-4 inline-block text-sm text-primary">Acessar →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-runic">Últimos comunicados</p>
            <h2 className="mt-3 text-2xl md:text-3xl">Do salão do conselho</h2>
          </div>
          <Link to="/noticias-eventos" className="text-sm text-primary">
            Ver todas →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {(news.data ?? []).slice(0, 3).map((item) => (
            <article key={item.id} className="panel rounded-lg p-6">
              <p className="text-runic">{item.category}</p>
              <h3 className="mt-3 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
            </article>
          ))}
          {news.isPending
            ? [0, 1, 2].map((i) => <div key={i} className="panel h-40 animate-pulse rounded-lg" />)
            : null}
        </div>
      </section>
    </main>
  );
}
