export interface Product {
  code: string;
  title: string;
  primaryImg: string;
  secondaryImg: string;
  price: number;
  category: "MEN" | "WOMEN";
}

const IMG = [
  "/brand/photo_2026-05-12 16.55.01.jpeg",
  "/brand/photo_2026-05-12 16.55.04.jpeg",
  "/brand/photo_2026-05-12 16.55.07.jpeg",
];
const enc = (p: string) => encodeURI(p);
const pair = (i: number) => ({
  primaryImg: enc(IMG[i % IMG.length]),
  secondaryImg: enc(IMG[(i + 1) % IMG.length]),
});

export const products: Product[] = [
  {
    code: "4339",
    title: "Forme Compression Tee",
    ...pair(0),
    price: 38,
    category: "MEN",
  },
  {
    code: "4016",
    title: "Natural Cotton Tee",
    ...pair(1),
    price: 34,
    category: "WOMEN",
  },
  {
    code: "0425",
    title: "Immortal Joggers",
    ...pair(2),
    price: 62,
    category: "MEN",
  },
  {
    code: "4230",
    title: "Athletic Tech Shorts",
    ...pair(0),
    price: 42,
    category: "WOMEN",
  },
  {
    code: "0502",
    title: "Cutoff Stringer",
    ...pair(1),
    price: 28,
    category: "MEN",
  },
  {
    code: "0501",
    title: "Essential Hoodie",
    ...pair(2),
    price: 78,
    category: "WOMEN",
  },
  {
    code: "4250",
    title: "Lifter Tank",
    ...pair(0),
    price: 32,
    category: "MEN",
  },
  {
    code: "0415",
    title: "Pleated Twin Pants",
    ...pair(1),
    price: 68,
    category: "WOMEN",
  },
];
