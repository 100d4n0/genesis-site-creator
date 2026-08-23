-- roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "roles select" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- new user hook
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- content tables
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  category TEXT NOT NULL DEFAULT 'Comunicado',
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'Evento',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.server_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'online',
  players_online INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_name TEXT NOT NULL,
  char_class TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  guild TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'level',
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.guild_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season TEXT NOT NULL,
  guild_name TEXT NOT NULL,
  fame INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.hall_of_fame (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season TEXT NOT NULL,
  title TEXT NOT NULL,
  winner TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_label TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.guide_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Guia',
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- grants + rls + policies for public content
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['news','events','server_status','rankings','guild_seasons','hall_of_fame','shop_items','guide_sections']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT USING (true)', t);
    EXECUTE format('CREATE POLICY "admin write %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.has_role(auth.uid(),''admin'')) WITH CHECK (public.has_role(auth.uid(),''admin''))', t);
    EXECUTE format('CREATE TRIGGER %1$s_updated_at BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- seed content
INSERT INTO public.news (title, excerpt, body, category, featured, published_at) VALUES
('Abertura oficial do WYD Genesis', 'O reino está aberto. Servidores estáveis e equipe de suporte ativa.', 'O portal oficial do WYD Genesis está no ar. Baixe o cliente, crie sua conta e participe das guerras de território desde o primeiro dia. A equipe publica todos os comunicados e agendas por aqui.', 'Comunicado', true, now() - interval '2 days'),
('Guerra de Território — nova temporada', 'Confrontos semanais valendo fama de guilda e recompensas exclusivas.', 'A temporada de guerra de território começa neste fim de semana. As guildas inscritas disputam pontos de fama que definem o ranking oficial da temporada.', 'Evento', true, now() - interval '5 days'),
('Manutenção programada', 'Ajustes de balanceamento e correções de estabilidade.', 'Manutenção programada com duração estimada de 40 minutos. Avisos de retorno são publicados na página de status do servidor.', 'Manutenção', false, now() - interval '9 days'),
('Regras atualizadas contra uso de programas', 'Tolerância zero para automação e exploits.', 'As regras do reino foram atualizadas. Contas flagradas com automação, macro ou exploração de falhas são banidas permanentemente sem reembolso.', 'Regras', false, now() - interval '14 days');

INSERT INTO public.events (title, description, event_type, starts_at, ends_at) VALUES
('Guerra de Território', 'Disputa oficial entre guildas pelos castelos do reino.', 'Guerra', now() + interval '2 days', now() + interval '2 days 2 hours'),
('Caça ao Tesouro', 'Baús raros espalhados pelos mapas de alto nível.', 'Tesouro', now() + interval '4 days', now() + interval '4 days 3 hours'),
('Invasão de Boss', 'Bosses de temporada aparecem nas capitais.', 'Boss', now() + interval '6 days', now() + interval '6 days 1 hour'),
('Torneio de Arena', 'Duelos 1v1 e 3v3 com premiação em itens.', 'Arena', now() + interval '9 days', now() + interval '9 days 4 hours'),
('Bônus de Experiência', 'Fim de semana com experiência aumentada para todos.', 'Bônus', now() + interval '11 days', now() + interval '13 days');

INSERT INTO public.server_status (server_name, state, players_online, message) VALUES
('Genesis — Principal', 'online', 428, 'Servidor estável, sem incidentes registrados.'),
('Genesis — Arena', 'online', 96, 'Arena disponível para duelos e torneios.'),
('Genesis — Teste', 'manutencao', 0, 'Servidor de teste em manutenção para validação de patch.');

INSERT INTO public.rankings (character_name, char_class, level, guild, score, category, position) VALUES
('Valkyrian','Guerreiro',400,'Dominus',998450,'level',1),
('Nihilus','Mago',399,'Aeterna',975200,'level',2),
('Sarkhan','Arqueiro',398,'Dominus',962110,'level',3),
('Morgaine','Transknight',397,'Nocturna',940880,'level',4),
('Kael','Foema',396,'Aeterna',928400,'level',5),
('Ravenor','Guerreiro',395,'Dominus',15420,'pk',1),
('Baltasar','Transknight',392,'Nocturna',13980,'pk',2),
('Ilyana','Arqueiro',390,'Aeterna',12760,'pk',3),
('Dominus','Guilda',0,'Dominus',88400,'fama',1),
('Aeterna','Guilda',0,'Aeterna',81200,'fama',2),
('Nocturna','Guilda',0,'Nocturna',77650,'fama',3);

INSERT INTO public.guild_seasons (season, guild_name, fame, position, notes) VALUES
('Temporada IV','Dominus',88400,1,'Campeã de guerra de território.'),
('Temporada IV','Aeterna',81200,2,'Vice-campeã, maior número de castelos tomados.'),
('Temporada IV','Nocturna',77650,3,'Melhor desempenho em arena de guildas.'),
('Temporada III','Aeterna',74300,1,'Campeã da temporada anterior.');

INSERT INTO public.hall_of_fame (season, title, winner, description) VALUES
('Temporada IV','Guilda Campeã','Dominus','Vitória confirmada na guerra de território final.'),
('Temporada IV','Maior Nível','Valkyrian','Primeiro personagem a alcançar o nível máximo da temporada.'),
('Temporada III','Guilda Campeã','Aeterna','Domínio de todos os castelos por três semanas consecutivas.'),
('Temporada III','Rei da Arena','Kael','Invicto no torneio 1v1 da temporada.');

INSERT INTO public.shop_items (name, description, price_label, featured, position) VALUES
('Pacote Iniciante','Equipamento básico, poções e montaria temporária para começar bem.','R$ 19,90',true,1),
('Pacote Guerreiro','Conjunto de refino, pergaminhos e itens de suporte para PvP.','R$ 49,90',true,2),
('Pacote Guilda','Bônus de fama e itens coletivos para guildas em temporada.','R$ 99,90',false,3),
('Baú Especial','Baú com itens aleatórios de temporada e chance de item raro.','R$ 29,90',false,4);

INSERT INTO public.guide_sections (title, body, category, position) VALUES
('Primeiros passos','Baixe o cliente pelo link oficial, crie sua conta no portal e entre no servidor principal. Recomendamos começar pelas missões de nível inicial para conseguir equipamento básico.','Início',1),
('Criação de conta','A conta é criada pelo portal com e-mail e senha. Use um e-mail válido: ele é a única forma de recuperar o acesso.','Início',2),
('Regras do reino','É proibido usar qualquer tipo de automação, macro, bot ou exploração de falhas. Contas flagradas são banidas permanentemente. Respeite os outros jogadores no chat.','Regras',3),
('Segurança da conta','Nunca compartilhe sua senha. A equipe nunca pede senha por mensagem privada, Discord ou qualquer outro canal.','Segurança',4),
('Sistemas de jogo','Guerra de território, arena, temporada de guildas, refino de itens e eventos semanais compõem os sistemas principais do servidor.','Sistemas',5),
('Suporte','Dúvidas e denúncias devem ser enviadas pelos canais oficiais da equipe. Inclua nome da conta e do personagem para agilizar o atendimento.','Suporte',6);