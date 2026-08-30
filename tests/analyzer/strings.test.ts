import { describe, expect, it } from 'vitest';

import { toNaturalWords } from '../../src/utils/strings.js';

describe('toNaturalWords', () => {
  it.each([
    ['handleUserLogin', 'handle user login'],
    ['createInvoicePDF', 'create invoice pdf'],
    ['MobileMenu', 'mobile menu'],
    ['user_profile', 'user profile'],
  ])('converts %s to natural words', (input, expected) => {
    expect(toNaturalWords(input)).toBe(expected);
  });
});
