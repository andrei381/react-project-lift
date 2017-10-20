/**
 * Test async injectors
 */

import deepReplace from '../deepReplace';

describe('deepReplace', () => {
  describe('', () => {
    it('replaces all nested objects with `value` and `label` keys with strings', () => {
      const actual = {
        obj: {
          nested: [
            {
              value: 'hey',
              label: 'hey',
            },
            {
              value: 'ho',
              label: 'ho',
            },
          ],
        },
      };
      const expected = {
        obj: {
          nested: ['hey', 'ho'],
        },
      };

      expect(deepReplace(actual)).toEqual(expected);
    });
  });
});
