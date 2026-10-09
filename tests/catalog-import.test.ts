import { describe, expect, it } from 'vitest';
import { CatalogImportError, importCatalogCsv, parseCatalogCsv } from '../src/catalog/catalog-import.js';

const HEADER = 'sku,description,weight,weightUnit,lengthIn,widthIn,heightIn,handlingCodes';

describe('catalog import', () => {
  it('imports pound-denominated rows', () => {
    const csv = [
      HEADER,
      'SKU-10021,Ceramic planter 8 in,3.4,lb,9,9,8.5,FRAGILE',
      'SKU-10047,Citrus all-purpose cleaner 32 fl oz,2.2,lb,3.5,3.5,10,HAZMAT_CLASS_3;KEEP_UPRIGHT',
    ].join('\n');
    const items = importCatalogCsv(csv);
    expect(items.size).toBe(2);
    expect(items.get('SKU-10021')).toEqual({
      sku: 'SKU-10021',
      description: 'Ceramic planter 8 in',
      unitWeightLb: 3.4,
      dimensionsIn: { l: 9, w: 9, h: 8.5 },
      handlingCodes: ['FRAGILE'],
    });
    expect(items.get('SKU-10047')?.handlingCodes).toEqual(['HAZMAT_CLASS_3', 'KEEP_UPRIGHT']);
  });

  it('rejects an unknown weight unit', () => {
    expect(() => parseCatalogCsv(`${HEADER}\nSKU-1,Thing,1,kg,1,1,1,`)).toThrow(CatalogImportError);
  });

  it('rejects an unknown handling code', () => {
    expect(() => parseCatalogCsv(`${HEADER}\nSKU-1,Thing,1,lb,1,1,1,LIQUID`)).toThrow(/handling code/);
  });

  it('rejects an unexpected header', () => {
    expect(() => parseCatalogCsv('sku,weight\nSKU-1,1')).toThrow(/header/);
  });
});
