export interface IssueMeta {
  slug: string;
  title: string;
  number?: number;
  edition?: number;
  quote: string;
  source?: string;
  color?: string;
  cover: string;
}

export const issuesData: IssueMeta[] = [
  {
    slug: "transition",
    title: "Transition",
    edition: 7,
    quote:
      "Not everything that is faced can be changed, but nothing can be changed until it is faced.",
    source: "James Baldwin",
    color: "#999",
    cover: "",
  },
  {
    slug: "dedication",
    title: "Dedication",
    number: 8,
    quote:
      "Great things are not something accidental, they must be distinctly willed.",
    source: "Vincent van Gogh",
    color: "#4580C2",
    cover: "",
  },
  {
    slug: "pleasure",
    title: "Pleasure",
    number: 9,
    quote:
      "Pleasure to me is wonder— the unexplored, the unexpected, the thing that is hidden and the changeless thing that lurks behind superficial mutability.",
    source: "H.P. Lovecraft",
    color: "#d66a6a",
    cover: "",
  },
  {
    slug: "discovery",
    title: "Discovery",
    number: 10,
    quote:
      "Our real discoveries come from chaos, from going to the place that looks wrong and stupid and foolish.",
    source: "Chuck Palahniuk, Invisible Monsters",
    color: "#414a4c",
    cover: "",
  },
  {
    slug: "perspective",
    title: "Perspective",
    number: 11,
    quote: "One person's craziness is another person's reality.",
    source: "Tim Burton",
    color: "#a2add0",
    cover: "",
  },
];
