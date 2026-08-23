import type { ReactNode } from "react";

interface PageShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Cabeçalho padrão das páginas internas, com faixa dourada e título serifado. */
export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 pt-14 pb-8">
      <header className="text-center">
        <p className="text-runic">{eyebrow}</p>
        <h1 className="mt-4 text-3xl md:text-5xl">{title}</h1>
        <div className="gold-rule mx-auto mt-6 w-40" />
        {description ? (
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="mt-12">{children}</div>
    </main>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="panel rounded-lg px-6 py-12 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="panel h-32 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
