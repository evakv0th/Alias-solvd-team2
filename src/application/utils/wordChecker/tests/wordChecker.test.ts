import { WordChecker } from '../wordChecker';

describe('WordChecker', () => {
  describe('isMessageValid', () => {
    test('should return true when guessed word is a stem of word to check', () => {
      const message = "today was an informal meeting";
      const wordToCheck = "formal";
      const isValid = WordChecker.isMessageValid(message, wordToCheck);
      expect(isValid).toBe(true);
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

    test('should return false when message contains unrelated words', () => {
      const message = "unrelated topic";
      const wordToCheck = "related";
      const isValid = WordChecker.isMessageValid(message, wordToCheck);
      expect(isValid).toBe(true);
    });

    test('should return true when message contains unrelated words', () => {
        const message = "today was informal meeting";
        const wordToCheck = "formal";
        const isValid = WordChecker.isMessageValid(message, wordToCheck);
        expect(isValid).toBe(true);
    });

    test('should return true when message contains unrelated words', () => {
        const message = "unhappiness followed by the rain";
        const wordToCheck = "happy";
        const isValid = WordChecker.isMessageValid(message, wordToCheck);
        expect(isValid).toBe(true);
    });

  });


  describe('WordChecker - specific real cases', () => {
    describe('isWordValid', () => {
      it('should return false if the guessed word is the same as the word to check', () => {
        expect(WordChecker.isWordValid('apple', 'apple')).toBe(false);
      });
  
      it('should return true if the guessed word is different from the word to check', () => {
        expect(WordChecker.isWordValid('banana', 'apple')).toBe(true);
      });
    });
  
    describe('isMessageValid', () => {
      it('should return false if any word in the message is the same as the word to check', () => {
        expect(WordChecker.isMessageValid('I ate an apple this morning', 'apple')).toBe(false);
      });
  
      it('should return true if no words in the message are the same as the word to check', () => {
        expect(WordChecker.isMessageValid('I had a banana for breakfast', 'apple')).toBe(true);
      });
    });
  });

});
