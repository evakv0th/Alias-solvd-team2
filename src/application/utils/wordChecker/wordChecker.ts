function separationMap(letter: string): string {
  return `[^a-zA-Z]?${letter}[^a-zA-Z]?`;
}

function letterMap(letter: string): string {
  const map = {
    'a': '[a4@]',
    'b': '[b8]',
    'e': '[e3]',
    'i': '[i1!]',
    'l': '[l1|]',
    'o': '[o0]',
    's': '[s$]',
    't': '[t7]'
  };
  return map[letter.toLowerCase()] || letter;
}

function regexMapper(word: string, ...mappers: { (letter: string): string }[]) {
  return word.replace(/[a-z]/gi, (letter) => {
    return mappers.reduce((acc, mapper) => {
      return mapper(acc);
    }, letter);
  })
}

export default function isForbidden(text: string, wordToCheck: string): boolean {
  const regex = new RegExp(regexMapper(wordToCheck, letterMap, separationMap), 'gi');
  return regex.test(text);
}