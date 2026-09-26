export const formatLKR = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-US")}`;

export const waLink = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const cn = (...c: (string | number | false | null | undefined)[]) => c.filter(Boolean).join(" ");

