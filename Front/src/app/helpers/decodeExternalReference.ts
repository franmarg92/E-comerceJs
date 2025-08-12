import { OrderData } from '../models/orderData';
export function decodeExternalReference(encoded: string): OrderData | null {
  try {
    const decoded = decodeURIComponent(encoded);
    const parsed = JSON.parse(decoded);

    // Validación mínima
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.userId === 'string' &&
      typeof parsed.shippingAddressId === 'string' &&
      Array.isArray(parsed.items)
    ) {
      return parsed as OrderData;
    }

    return null;
  } catch {
    return null;
  }
}
