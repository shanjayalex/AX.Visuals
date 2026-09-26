import "server-only";
import { createHash } from "node:crypto";

const md5 = (s: string) => createHash("md5").update(s).digest("hex").toUpperCase();

export const payhereConfigured = () => !!(process.env.PAYHERE_MERCHANT_ID && process.env.PAYHERE_MERCHANT_SECRET);

export const payhereAction = () =>
  process.env.PAYHERE_SANDBOX === "false" ? "https://www.payhere.lk/pay/checkout" : "https://sandbox.payhere.lk/pay/checkout";

/** Checkout hash: MD5(merchant_id + order_id + amount + currency + MD5(secret)).upper() */
export function checkoutHash(orderId: string, amount: string, currency = "LKR") {
  const id = process.env.PAYHERE_MERCHANT_ID!;
  return md5(id + orderId + amount + currency + md5(process.env.PAYHERE_MERCHANT_SECRET!));
}

/** Notify signature: MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(secret)).upper() */
export function verifyNotify(p: Record<string, string>) {
  const local = md5(
    p.merchant_id + p.order_id + p.payhere_amount + p.payhere_currency + p.status_code + md5(process.env.PAYHERE_MERCHANT_SECRET!),
  );
  return local === p.md5sig && p.merchant_id === process.env.PAYHERE_MERCHANT_ID;
}

export function checkoutFields(opts: {
  orderId: string;
  amount: number;
  item: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  baseUrl: string;
}) {
  const amount = opts.amount.toFixed(2);
  return {
    merchant_id: process.env.PAYHERE_MERCHANT_ID!,
    return_url: `${opts.baseUrl}/booking/confirmed?ref=${opts.orderId}`,
    cancel_url: `${opts.baseUrl}/booking?cancelled=${opts.orderId}`,
    notify_url: `${opts.baseUrl}/api/payhere/notify`,
    order_id: opts.orderId,
    items: opts.item,
    currency: "LKR",
    amount,
    first_name: opts.firstName,
    last_name: opts.lastName || "-",
    email: opts.email,
    phone: opts.phone,
    address: opts.address || "-",
    city: opts.city,
    country: "Sri Lanka",
    hash: checkoutHash(opts.orderId, amount),
  };
}
