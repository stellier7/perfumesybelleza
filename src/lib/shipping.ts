import { DEPARTMENTS, SHIPPING_LPS, type Department } from "@/config";

export function isDepartment(value: string): value is Department {
  return (DEPARTMENTS as readonly string[]).includes(value);
}

/** El precio no cambia por departamento. El departamento solo va en la dirección. */
export function shippingCost(): number {
  return SHIPPING_LPS;
}

export function lowestShippingCost(): number {
  return SHIPPING_LPS;
}
