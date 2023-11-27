const commonPrefixes = [
  'un',
  're',
  'pre',
  'mis',
  'dis',
  'non',
  'in',
  'im',
  'il',
];
const commonEndings = [
  'able',
  'ible',
  'al',
  'ial',
  'ed',
  'en',
  'er',
  'est',
  'ful',
  'ic',
  'ing',
  'ion',
  'tion',
  'ation',
  'ition',
  'ty',
  'ive',
  'ative',
  'itive',
  'less',
  'ly',
  'ment',
  'ness',
  'ous',
  'eous',
  'ious',
  's',
  'es',
  'ed',
  'ing',
  'a',
  'o',
  'u',
  'i',
  'y',
  'e',
];

// const words = ['happy', 'play', 'like', 'do', 'agree', 'connect'];
// const wordsToCheck = [
//   'unhappiness',
//   'replay',
//   'dislike',
//   'redo',
//   'disagreement',
//   'disconnected',
// ];

function removeCommonPrefixesAndEndings(word: string): string | undefined {
  const prefixRegExp = new RegExp(`^(${commonPrefixes.join('|')})`);
  const endingRegExp = new RegExp(`(${commonEndings.join('|')})$`);

  const withoutPrefix = word.replace(prefixRegExp, '');
  let withoutEnding = withoutPrefix.replace(endingRegExp, '');

  while (endingRegExp.test(withoutEnding)) {
    withoutEnding = withoutEnding.replace(endingRegExp, '');
  }

  return withoutEnding;
}

export function wordChecker(word: string, wordForGuessing: string): boolean {
  const cleanedWord = removeCommonPrefixesAndEndings(word);
  const cleanedWordForGuessing =
    removeCommonPrefixesAndEndings(wordForGuessing);
  return cleanedWord !== cleanedWordForGuessing;
}

// for (let i = 0; i < words.length; i++) {
//   console.log(wordChecker(words[i], wordsToCheck[i]));
// }
