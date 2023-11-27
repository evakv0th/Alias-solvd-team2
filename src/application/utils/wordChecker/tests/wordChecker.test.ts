import { WordChecker } from '../wordChecker';

describe('WordChecker', () => {
  describe('isMessageValid', () => {
    test('should return when guessed word is a stem of word to check', () => {
      const message = "today was an informal meeting";
      const wordToCheck = "formal";
      const isValid = WordChecker.isMessageValid(message, wordToCheck);
      expect(isValid).toBe(false);
    });

    test('should return true when no word is a stem of word to check', () => {
      const message = "the sky is clear";
      const wordToCheck = "cloud";
      const isValid = WordChecker.isMessageValid(message, wordToCheck);
      expect(isValid).toBe(true);
    });

    test('should return false when a word is a stem of word to check', () => {
      const message = "feeling of happiness";
      const wordToCheck = "happy";
      const isValid = WordChecker.isMessageValid(message, wordToCheck);
      expect(isValid).toBe(false);
    });

    test('should return true when message contains unrelated words', () => {
      const message = "unrelated topic";
      const wordToCheck = "related";
      const isValid = WordChecker.isMessageValid(message, wordToCheck);
      expect(isValid).toBe(true);
    });

    test('should return true when message contains unrelated words', () => {
        const message = "today was informal meeting";
        const wordToCheck = "formal";
        const isValid = WordChecker.isMessageValid(message, wordToCheck);
        expect(isValid).toBe(false);
    });

    test('should return true when message contains unrelated words', () => {
        const message = "unhappiness followed by the rain";
        const wordToCheck = "happy";
        const isValid = WordChecker.isMessageValid(message, wordToCheck);
        expect(isValid).toBe(false);
    });

  });
});
