import { Link } from "@tanstack/react-router";

import { NAV_ITEMS } from "@/components/site/SiteHeader";
import { DOWNLOAD_URL } from "@/lib/queries";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg tracking-[0.24em] text-primary uppercase">
            WYD Genesis
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Portal oficial do reino. Comunicados, agenda, rankings e regras publicados pela equipe do
            servidor.
          </p>
        </div>

        <div>
          <p className="text-runic">Páginas</p>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-runic">Comece a jogar</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted-foreground hover:text-primary"
              >
                Baixar o cliente do jogo
              </a>
            </li>
            <li>
              <Link to="/auth" className="text-muted-foreground hover:text-primary">
                Criar conta no portal
              </Link>
            </li>
            <li>
              <Link to="/guia" className="text-muted-foreground hover:text-primary">
                Regras e segurança
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WYD Genesis. Todos os direitos reservados.
      </div>
    </footer>
  );
}
