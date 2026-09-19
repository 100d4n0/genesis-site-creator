import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { DOWNLOAD_URL } from "@/lib/queries";

export const Route = createFileRoute("/comece-agora")({
  head: () => ({
    meta: [
      { title: "Comece agora — WYD Genesis" },
      {
        name: "description",
        content:
          "Primeiros passos no WYD Genesis: baixe o cliente, crie sua conta e entre no reino em poucos minutos.",
      },
      { property: "og:title", content: "Comece agora — WYD Genesis" },
      {
        property: "og:description",
        content: "Baixe o cliente, crie sua conta e entre no reino do WYD Genesis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StartPage,
});

const STEPS = [
  {
    n: "01",
    title: "Baixe o cliente",
    text: "Faça o download do pacote oficial e extraia em uma pasta de sua preferência.",
  },
  {
    n: "02",
    title: "Crie sua conta",
    text: "Registre-se com um e-mail válido e confirme o acesso para liberar o login.",
  },
  {
    n: "03",
    title: "Leia as regras",
    text: "Consulte o guia oficial para conhecer as regras do reino e proteger sua conta.",
  },
  {
    n: "04",
    title: "Entre no reino",
    text: "Abra o cliente, faça login e acompanhe a agenda de eventos da equipe.",
  },
];

function StartPage() {
  return (
    <PageShell
      eyebrow="06 · Início"
      title="Comece agora"
      description="Quatro passos para entrar no WYD Genesis."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {STEPS.map((step) => (
          <section key={step.n} className="panel rounded-lg p-6 md:p-8">
            <p className="text-runic">{step.n}</p>
            <h2 className="mt-3 text-xl">{step.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{step.text}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
        <Button asChild size="lg" variant="ghost">
          <Link to="/guia">Ler o guia</Link>
        </Button>
      </div>
    </PageShell>
  );
}
