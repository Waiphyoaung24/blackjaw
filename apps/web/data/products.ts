export interface Product {
  code: string;
  title: string;
  primaryImg: string;
  secondaryImg: string;
  colors: { name: string; hex: string }[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
}

const SWATCH: Record<string, string> = {
  grey: "#8a8a8a",
  black: "#111111",
  burgundy: "#6b1f2a",
  navy: "#1c2540",
  olive: "#5b6236",
  white: "#f4f4f4",
  charcoal: "#2c2c2c",
  sand: "#d6c5a4",
  forest: "#2c4a32",
  stone: "#b8aea1",
};
const c = (...names: string[]) =>
  names.map((n) => ({ name: n, hex: SWATCH[n] ?? "#999" }));

const HIM_PRIMARY = "/blackjaw/product-4339-primary.jpg";
const HIM_SECONDARY = "/blackjaw/product-4339-secondary.jpg";
const HIM2_PRIMARY = "/blackjaw/product-4016-primary.jpg";
const HIM2_SECONDARY = "/blackjaw/product-4016-secondary.jpg";

export const products: Product[] = [
  {
    code: "4339",
    title: "Forme Compression Tees",
    primaryImg: HIM_PRIMARY,
    secondaryImg: HIM_SECONDARY,
    colors: c("grey", "black", "burgundy", "navy", "olive"),
    rating: 4.8,
    reviewCount: 142,
    isNew: true,
  },
  {
    code: "4016",
    title: "Natural Cotton Compression Tees",
    primaryImg: HIM2_PRIMARY,
    secondaryImg: HIM2_SECONDARY,
    colors: c("grey", "olive", "black", "white"),
    rating: 4.7,
    reviewCount: 98,
  },
  {
    code: "425",
    title: "Immortal Joggers",
    primaryImg: HIM_PRIMARY,
    secondaryImg: HIM_SECONDARY,
    colors: c("black", "charcoal", "navy"),
    rating: 4.9,
    reviewCount: 204,
  },
  {
    code: "4230",
    title: "Athletic Tech Shorts",
    primaryImg: HIM2_PRIMARY,
    secondaryImg: HIM2_SECONDARY,
    colors: c("black", "olive", "sand"),
    rating: 4.6,
    reviewCount: 87,
  },
  {
    code: "502",
    title: "Cutoff Stringer",
    primaryImg: HIM_PRIMARY,
    secondaryImg: HIM_SECONDARY,
    colors: c("white", "black", "burgundy"),
    rating: 4.5,
    reviewCount: 64,
  },
  {
    code: "501",
    title: "Essential Hoodie",
    primaryImg: HIM2_PRIMARY,
    secondaryImg: HIM2_SECONDARY,
    colors: c("black", "grey", "forest"),
    rating: 4.8,
    reviewCount: 178,
    isNew: true,
  },
  {
    code: "4250",
    title: "Lifter Tank",
    primaryImg: HIM_PRIMARY,
    secondaryImg: HIM_SECONDARY,
    colors: c("black", "white", "olive"),
    rating: 4.7,
    reviewCount: 112,
  },
  {
    code: "415",
    title: "Pleated Twin Pants",
    primaryImg: HIM2_PRIMARY,
    secondaryImg: HIM2_SECONDARY,
    colors: c("stone", "black", "sand"),
    rating: 4.6,
    reviewCount: 75,
  },
];
