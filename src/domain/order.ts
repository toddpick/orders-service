export const ORDER_STATUSES = [
  'PLACED',
  'PAID',
  'PICKING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const HANDLING_CODES = [
  'FRAGILE',
  'PERISHABLE',
  'KEEP_UPRIGHT',
  'HAZMAT_CLASS_3',
  'HIGH_VALUE',
] as const;
export type HandlingCode = (typeof HANDLING_CODES)[number];

export type DeliveryPreference = 'STANDARD' | 'EVENING';

export interface Customer {
  fullName: string;
  email: string;
  /** E.164, e.g. +15555550123. Optional: not every customer provides one. */
  phone?: string;
}

export interface ShipTo {
  /** Free text, multi-line, exactly as typed by the customer at checkout. */
  addressText: string;
  postalCode: string;
  countryCode: string;
}

export interface DimensionsIn {
  l: number;
  w: number;
  h: number;
}

export interface OrderItem {
  sku: string;
  description: string;
  quantity: number;
  /** Weight of one unit, in pounds. */
  unitWeightLb: number;
  dimensionsIn: DimensionsIn;
  handlingCodes: HandlingCode[];
}

export interface Order {
  /** ORD-YYYY-NNNNNN */
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  packedAt?: string;
  customer: Customer;
  shipTo: ShipTo;
  items: OrderItem[];
  totalValueCents: number;
  currency: 'USD';
  /** Date only, YYYY-MM-DD. Shown to the customer at checkout. */
  promisedDeliveryDate: string;
  deliveryPreference: DeliveryPreference;
  /** One order is treated as one shipment. */
  shipmentId: string | null;
}

/** Orders at or above this value need a signature on delivery ($500.00). */
export const SIGNATURE_THRESHOLD_CENTS = 50_000;

const NON_CANCELLABLE: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
]);

/** An order can be cancelled until it reaches SHIPPED. */
export function canCancel(order: Pick<Order, 'status'>): boolean {
  return !NON_CANCELLABLE.has(order.status);
}

export function requiresSignature(order: Pick<Order, 'totalValueCents'>): boolean {
  return order.totalValueCents >= SIGNATURE_THRESHOLD_CENTS;
}

const ORDER_NUMBER_PATTERN = /^ORD-\d{4}-\d{6}$/;

export function isValidOrderNumber(value: string): boolean {
  return ORDER_NUMBER_PATTERN.test(value);
}
