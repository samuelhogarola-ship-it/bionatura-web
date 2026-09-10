export interface OrderLine { productId: string; quantityLabel: string }
export interface OrderState { version: 1; lines: OrderLine[] }

export const EMPTY_ORDER: OrderState = { version: 1, lines: [] };

export function upsertLine(state: OrderState, line: OrderLine): OrderState {
  const remaining = state.lines.filter((item) => item.productId !== line.productId);
  return { version: 1, lines: [...remaining, { ...line }] };
}

export function removeLine(state: OrderState, productId: string): OrderState {
  return { version: 1, lines: state.lines.filter((line) => line.productId !== productId).map((line) => ({ ...line })) };
}

export function clearOrder(): OrderState {
  return { version: 1, lines: [] };
}

export function serializeOrder(state: OrderState): string {
  return JSON.stringify({ version: 1, lines: state.lines.map((line) => ({ ...line })) });
}

function validLabel(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 40 && !/[\u0000-\u001f\u007f]/.test(value);
}

export function parseStoredOrder(raw: string | null | undefined, validProductIds: ReadonlySet<string>): OrderState {
  if (typeof raw !== 'string') return clearOrder();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || !('lines' in parsed)) return clearOrder();
    const candidate = parsed as { version?: unknown; lines?: unknown };
    if (candidate.version !== 1 || !Array.isArray(candidate.lines)) return clearOrder();
    const lines: OrderLine[] = [];
    for (const item of candidate.lines) {
      if (typeof item !== 'object' || item === null) continue;
      const line = item as { productId?: unknown; quantityLabel?: unknown };
      if (typeof line.productId === 'string' && validProductIds.has(line.productId) && validLabel(line.quantityLabel)) {
        if (!lines.some((existing) => existing.productId === line.productId)) lines.push({ productId: line.productId, quantityLabel: line.quantityLabel });
      }
    }
    return { version: 1, lines };
  } catch {
    return clearOrder();
  }
}
