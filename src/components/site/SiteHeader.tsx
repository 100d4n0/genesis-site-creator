import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Shield } from "lucide-react";

import crest from "@/assets/crest.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Início" },
  { to: "/noticias-eventos", label: "Notícias" },
  { to: "/status-servidor", label: "Servidor" },
  { to: "/ranking", label: "Ranking" },
  { to: "/comunidade", label: "Comunidade" },
  { to: "/guia", label: "Guia" },
  { to: "/calendario", label: "Calendário" },
  { to: "/hall-da-fama", label: "Hall da Fama" },
  { to: "/temporada-guildas", label: "Guildas" },
  { to: "/vitrine", label: "Vitrine" },
  { to: "/comece-agora", label: "Comece Agora" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="WYD Genesis — início">
          <img src={crest} alt="Brasão do WYD Genesis" width={40} height={40} className="h-9 w-9" />
          <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.28em] text-primary uppercase">
            Genesis
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded px-2.5 py-1.5 text-xs tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-3">
          {isAdmin ? (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/admin">
                <Shield className="mr-1 h-4 w-4" /> Admin
              </Link>
            </Button>
          ) : null}
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/conta">Minha conta</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ mode: "registrar" }}>
                  Criar conta
                </Link>
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card">
              <SheetTitle className="text-runic">Navegação</SheetTitle>
              <nav className="mt-6 flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "border-b border-border py-3 text-sm tracking-[0.14em] uppercase",
                      "text-muted-foreground transition-colors hover:text-primary",
                    )}
                    activeProps={{ className: "text-primary" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm tracking-[0.14em] text-primary uppercase"
                  >
                    Painel Admin
                  </Link>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
