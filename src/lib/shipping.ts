import {
  DEPARTMENTS,
  SHIPPING_BY_DEPARTMENT,
  SHIPPING_DEFAULT_LPS,
  type Department,
} from "@/config";

export function isDepartment(value: string): value is Department {
  return (DEPARTMENTS as readonly string[]).includes(value);
}

export function shippingCost(department: string): number {
  if (!isDepartment(department)) return SHIPPING_DEFAULT_LPS;
  return SHIPPING_BY_DEPARTMENT[department] ?? SHIPPING_DEFAULT_LPS;
}

export function lowestShippingCost(): number {
  const overrides = Object.values(SHIPPING_BY_DEPARTMENT).filter(
    (value): value is number => typeof value === "number",
  );
  return Math.min(SHIPPING_DEFAULT_LPS, ...overrides);
}
