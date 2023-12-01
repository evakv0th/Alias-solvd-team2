import isForbidden from '../wordChecker';
import fixtures from './test_fixtures.json';

describe('WordChecker', () => {
  describe('isMessageValid', () => {
    test('should return true when guessed word is a stem of word to check', () => {
      const message = "today was an informal meeting";
      const wordToCheck = "formal";
      const isValid = isForbidden(message, wordToCheck);
      expect(isValid).toBe(true); // 'informal' contains 'formal'
    });

    test('should return false when no word is a stem of word to check', () => {
      const message = "the sky is clear";
      const wordToCheck = "cloud";
      const isValid = isForbidden(message, wordToCheck);
      expect(isValid).toBe(false); // No stems or matches of 'cloud' in message
    });

    test('should return true when a word is a stem of word to check', () => {
      const message = "feeling of happiness";
      const wordToCheck = "happy";
      const isValid = isForbidden(message, wordToCheck);
      expect(isValid).toBe(true); // 'happiness' contains 'happy'
    });

    test('should return true when message contains word related to word to check', () => {
      const message = "unrelated topic";
      const wordToCheck = "related";
      const isValid = isForbidden(message, wordToCheck);
      expect(isValid).toBe(true); // 'unrelated' contains 'related'
    });

    test('should return true when message contains a stem of the word to check', () => {
        const message = "today was informal meeting";
        const wordToCheck = "formal";
        const isValid = isForbidden(message, wordToCheck);
        expect(isValid).toBe(true); // 'informal' contains 'formal'
    });

    test('should return true when message contains a stem of the word to check', () => {
        const message = "unhappiness followed by the rain";
        const wordToCheck = "happy";
        const isValid = isForbidden(message, wordToCheck);
        expect(isValid).toBe(true); // 'unhappiness' contains 'happy'
    });
  });

  describe('WordChecker - specific real cases', () => {
    describe('isWordValid', () => {
      it('should return false if the guessed word is the same as the word to check', () => {
        expect(isForbidden('apple', 'apple')).toBe(false);
      });

      it('should return true if the guessed word is different from the word to check', () => {
        expect(isForbidden('banana', 'apple')).toBe(true);
      });
    });

    describe('isMessageValid', () => {
      it('should return false if any word in the message is the same as the word to check', () => {
        expect(isForbidden('I ate an apple this morning', 'apple')).toBe(false);
      });

      it('should return true if no words in the message are the same as the word to check', () => {
        expect(isForbidden('I had a banana for breakfast', 'apple')).toBe(true);
      });
    });
  });
});


// const typedFixtures = fixtures as [string, string][];

// describe('... Supremacy test ...', () => {
//   typedFixtures.forEach(([input, output]) => {
//     test(`${input} should stem to ${output}`, () => {
//       const result = isForbidden(input, output);
//       expect(result).toBe(true);
//     });
//   });
// });
