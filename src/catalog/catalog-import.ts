import type { DimensionsIn, HandlingCode, OrderItem } from '../domain/order.js';
import { HANDLING_CODES } from '../domain/order.js';

export type WeightUnit = 'lb' | 'oz';

/** One row of a supplier catalog file. */
export interface CatalogRow {
  sku: string;
  description: string;
  weight: number;
  weightUnit: WeightUnit;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  handlingCodes: HandlingCode[];
}

/** Catalog data for one SKU, used to fill in order line items. */
export type CatalogItem = Pick<
  OrderItem,
  'sku' | 'description' | 'unitWeightLb' | 'dimensionsIn' | 'handlingCodes'
>;

export class CatalogImportError extends Error {
  constructor(
    readonly line: number,
    message: string,
  ) {
    super(`line ${line}: ${message}`);
    this.name = 'CatalogImportError';
  }
}

const EXPECTED_HEADER = [
  'sku',
  'description',
  'weight',
  'weightUnit',
  'lengthIn',
  'widthIn',
  'heightIn',
  'handlingCodes',
];

function parseNumber(raw: string | undefined, field: string, line: number): number {
  const value = Number(raw);
  if (raw === undefined || raw.trim() === '' || !Number.isFinite(value) || value < 0) {
    throw new CatalogImportError(line, `${field} must be a non-negative number`);
  }
  return value;
}

function parseHandling(raw: string | undefined, line: number): HandlingCode[] {
  if (!raw || raw.trim() === '') return [];
  return raw.split(';').map((code) => {
    const trimmed = code.trim();
    if (!(HANDLING_CODES as readonly string[]).includes(trimmed)) {
      throw new CatalogImportError(line, `unknown handling code "${trimmed}"`);
    }
    return trimmed as HandlingCode;
  });
}

/** Parse the supplier CSV (comma separated, no quoted fields) into rows. */
export function parseCatalogCsv(csv: string): CatalogRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const header = (lines[0] ?? '').split(',').map((h) => h.trim());
  if (header.join(',') !== EXPECTED_HEADER.join(',')) {
    throw new CatalogImportError(1, `unexpected header: ${header.join(',')}`);
  }
  return lines.slice(1).map((line, index) => {
    const lineNo = index + 2;
    const cols = line.split(',').map((c) => c.trim());
    const weightUnit = cols[3];
    if (weightUnit !== 'lb' && weightUnit !== 'oz') {
      throw new CatalogImportError(lineNo, `weightUnit must be lb or oz, got "${weightUnit ?? ''}"`);
    }
    const sku = cols[0];
    if (!sku) throw new CatalogImportError(lineNo, 'sku is required');
    return {
      sku,
      description: cols[1] ?? '',
      weight: parseNumber(cols[2], 'weight', lineNo),
      weightUnit,
      lengthIn: parseNumber(cols[4], 'lengthIn', lineNo),
      widthIn: parseNumber(cols[5], 'widthIn', lineNo),
      heightIn: parseNumber(cols[6], 'heightIn', lineNo),
      handlingCodes: parseHandling(cols[7], lineNo),
    };
  });
}

/** Convert catalog rows into catalog items keyed by SKU. */
export function importCatalog(rows: CatalogRow[]): Map<string, CatalogItem> {
  const items = new Map<string, CatalogItem>();
  for (const row of rows) {
    const dimensionsIn: DimensionsIn = { l: row.lengthIn, w: row.widthIn, h: row.heightIn };
    items.set(row.sku, {
      sku: row.sku,
      description: row.description,
      unitWeightLb: Math.round(row.weight * 1000) / 1000,
      dimensionsIn,
      handlingCodes: row.handlingCodes,
    });
  }
  return items;
}

export function importCatalogCsv(csv: string): Map<string, CatalogItem> {
  return importCatalog(parseCatalogCsv(csv));
}
