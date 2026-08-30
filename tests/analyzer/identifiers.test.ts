import { describe, expect, it } from 'vitest';

import { extractIdentifiers } from '../../src/analyzer/extractIdentifiers.js';
import { conceptFromPath } from '../../src/utils/paths.js';

describe('extractIdentifiers', () => {
  it('extracts normalized identifiers from common languages', () => {
    const diff = [
      '+export function createInvoicePDF() {}',
      '+const handleUserLogin = () => {}',
      '+class PaymentService {}',
      '+def calculate_total():',
      '+func CreateUser() {}',
      '+pub fn refresh_session() {}',
    ].join('\n');

    expect(extractIdentifiers(diff)).toEqual(
      expect.arrayContaining([
        'invoice pdf',
        'user login',
        'payment service',
        'calculate total',
        'create user',
        'refresh session',
      ]),
    );
  });
});

describe('conceptFromPath', () => {
  it.each([
    ['src/components/MobileMenu.tsx', 'mobile menu'],
    ['src/app/checkout/page.tsx', 'checkout'],
    ['src/api/auth/login.ts', 'login'],
  ])('derives %s as %s', (path, expected) => {
    expect(conceptFromPath(path)).toBe(expected);
  });
});
