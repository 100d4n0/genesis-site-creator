# WYD Genesis — Portal recriado no Lovable

Recriar o portal wydgenesis.com como app moderno (React + TanStack Start) com o mesmo estilo medieval escuro (preto/dourado/vermelho, tipografia serifada com pequenas capitais), 11 páginas e backend próprio no Lovable Cloud.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Hero com brasão, botões "Baixar o jogo" e "Criar conta", grade dos 10 sistemas, status do servidor em destaque |
| `/noticias-eventos` | Lista de notícias e comunicados (do banco) |
| `/status-servidor` | Status público, manutenções e avisos |
| `/guia` | Regras e guia do jogador |
| `/comunidade` | Indicadores: top jogadores e guildas |
| `/ranking` | Ranking ingame com abas (nível, PK, fama) |
| `/comece-agora` | Primeiros passos + link de download |
| `/calendario` | Agenda de eventos por data |
| `/hall-da-fama` | Temporadas e vencedores |
| `/temporada-guildas` | Fama de guildas e regras da temporada |
| `/vitrine` | Pacotes/itens em destaque da loja |

Header fixo com navegação completa (menu hambúrguer no mobile), footer com links e Discord, botões Entrar / Criar conta.

## Contas de usuário

- Registro e login por e-mail e senha (sessão persistente).
- Página `/conta`: dados do jogador, alterar senha.
- Painel `/admin` restrito a administradores: criar/editar/remover notícias, eventos, avisos de status, itens da vitrine, entradas de ranking, hall da fama e pacotes da loja.

## Backend (Lovable Cloud)

Tabelas: `profiles`, `user_roles` (admin/user), `news`, `events`, `server_status`, `rankings`, `guild_seasons`, `hall_of_fame`, `shop_items`, `guide_sections`.

- Leitura pública nas tabelas de conteúdo; escrita apenas para admin.
- RLS ativo em todas as tabelas, papel de admin em tabela separada (sem escalonamento de privilégio).
- Dados iniciais (seed) com o conteúdo real que aparece hoje no site, para as páginas já nascerem preenchidas.

## Artes

Geradas em estilo medieval escuro: brasão do reino, imagens de guerra/guilda/tesouro para os cartões e fundo do hero.

## Observações técnicas

- Ranking e status são editáveis pelo painel admin. Sincronização automática com o banco do servidor de jogo não está incluída — pode ser adicionada depois se você fornecer acesso/API.
- Conteúdo do site antigo é recriado a partir dos textos públicos; arquivos do jogo (o pacote de 140 MB) não são hospedados aqui — o botão de download aponta para o link externo atual.
- SEO por página: título, descrição e og tags próprios.
