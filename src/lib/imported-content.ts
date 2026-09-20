import type { HallOfFame, News, Ranking, ShopItem } from "@/lib/queries";

const IMPORTED_AT = "2026-09-20T14:25:00.000Z";

/** Conteúdo normalizado dos dumps MySQL enviados pelo proprietário do servidor. */
export const importedNews: News[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title: "Portal integrado aos registros do servidor",
    excerpt: "A vitrine e o ranking agora usam informações normalizadas dos bancos do WYD Genesis.",
    body: "Os dados públicos foram organizados para leitura rápida no portal. Novos comunicados publicados pela equipe aparecerão aqui junto aos registros importados.",
    category: "Comunicado",
    featured: true,
    published_at: IMPORTED_AT,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    title: "Temporada de rankings em acompanhamento",
    excerpt: "A evolução dos personagens passa a ser apresentada diretamente no portal.",
    body: "A classificação inicial considera os personagens encontrados no banco do jogo. A equipe poderá atualizar os registros oficiais conforme a temporada avançar.",
    category: "Ranking",
    featured: false,
    published_at: "2026-09-19T18:00:00.000Z",
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
];

export const importedShopItems: ShopItem[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    name: "Iniciante",
    description: "3.000 Donate Points para os primeiros passos no reino.",
    price_label: "R$ 1,00",
    featured: true,
    position: 1,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "Bronze",
    description: "5.000 Donate Points, 5 Frangos e 5 Baús de Experiência.",
    price_label: "R$ 50,00",
    featured: false,
    position: 2,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    name: "Prata",
    description: "10.000 Donate Points, 10 Frangos, 10 Baús de Experiência e Fada Azul por 3 dias.",
    price_label: "R$ 100,00",
    featured: true,
    position: 3,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    name: "Ouro",
    description: "25.000 Donate Points, 50 Frangos, 50 Baús de Experiência, Fada Azul e Divina por 30 dias.",
    price_label: "R$ 250,00",
    featured: true,
    position: 4,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    name: "Pack Natalino I",
    description: "12.500 Donate Points, 20 Frangos, 20 Baús de Experiência e 20 Pergaminhos Água N.",
    price_label: "R$ 100,00",
    featured: false,
    position: 5,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "20000000-0000-4000-8000-000000000006",
    name: "Pack Natalino II",
    description: "75.000 Donate Points, 120 Frangos, 120 Baús de Experiência e 120 Pergaminhos Água N.",
    price_label: "R$ 500,00",
    featured: false,
    position: 6,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
];

const classNames: Record<number, string> = {
  0: "Transknight",
  1: "Foema",
  2: "BeastMaster",
  3: "Huntress",
};

const characters = [
  ["BM200D4N0", 389, 2, 784],
  ["FUZAN", 220, 2, 210],
  ["HUSA", 200, 0, 9],
  ["LupDrup", 97, 1, 447],
  ["LeaoHT", 95, 3, 445],
  ["louka300", 67, 3, 537],
] as const;

export const importedRankings: Ranking[] = characters.map(
  ([characterName, level, classCode, score], index) => ({
    id: `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    character_name: characterName,
    char_class: classNames[classCode] ?? "Desconhecida",
    level,
    guild: null,
    score,
    category: "level",
    position: index + 1,
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  }),
);

/** O dump contém a estrutura do Hall da Fama, mas ainda não possui vencedores cadastrados. */
export const importedHallOfFame: HallOfFame[] = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    season: "Demonstração",
    title: "Maior nível da importação inicial",
    winner: "BM200D4N0",
    description: "Registro demonstrativo calculado a partir dos personagens presentes no dump do servidor.",
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    season: "Demonstração",
    title: "Destaque de evolução",
    winner: "FUZAN",
    description: "Registro demonstrativo até que a primeira temporada oficial seja encerrada e confirmada.",
    created_at: IMPORTED_AT,
    updated_at: IMPORTED_AT,
  },
];
