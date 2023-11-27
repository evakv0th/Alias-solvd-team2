import  { LanguageProcessing }  from './LanguageProcessing/LanguageProcessing';

class WordChecker 
{
  static isWordValid(guessedWord: string, wordToCheck: string): boolean 
  {
    const stemmedGuessedWord = LanguageProcessing.stem(guessedWord.toLowerCase());
    const stemmedWordToCheck = LanguageProcessing.stem(wordToCheck.toLowerCase());

    return stemmedGuessedWord !== stemmedWordToCheck;
  }

  static isMessageValid(message: string, wordToCheck: string): boolean 
  {
    const normalizedMsg = message.toLowerCase().replace(/[^a-z\s]/gi, '');
    const wordsInMsg = normalizedMsg.split(/\s+/);

    for (const word of wordsInMsg) 
    {
      if (!this.isWordValid(word, wordToCheck)) 
      {
        return false;
      }
    }

    return true;
  }
}

export { WordChecker };
