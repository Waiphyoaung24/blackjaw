export interface Product {
  code: string;
  title: string;
  primaryImg: string;
  secondaryImg: string;
  price: number;
  category: "MEN" | "WOMEN";
}

const HERO = encodeURI("/brand/photo_2026-05-12 16.55.01.jpeg");
const pair = () => ({
  primaryImg: HERO,
  secondaryImg: HERO,
});

export const products: Product[] = [
  {
    code: "4339",
    title: "Forme Compression Tee",
    ...pair(),
    price: 38,
    category: "MEN",
  },
  {
    code: "4016",
    title: "Natural Cotton Tee",
    ...pair(),
    price: 34,
    category: "WOMEN",
  },
  {
    code: "0425",
    title: "Immortal Joggers",
    ...pair(),
    price: 62,
    category: "MEN",
  },
  {
    code: "4230",
    title: "Athletic Tech Shorts",
    ...pair(),
    price: 42,
    category: "WOMEN",
  },
  {
    code: "0502",
    title: "Cutoff Stringer",
    ...pair(),
    price: 28,
    category: "MEN",
  },
  {
    code: "0501",
    title: "Essential Hoodie",
    ...pair(),
    price: 78,
    category: "WOMEN",
  },
  {
    code: "4250",
    title: "Lifter Tank",
    ...pair(),
    price: 32,
    category: "MEN",
  },
  {
    code: "0415",
    title: "Pleated Twin Pants",
    ...pair(),
    price: 68,
    category: "WOMEN",
  },
];
