/**
 * 
 * porterStemmer.ts
 * 
 */

export class PorterStemmer {

    // Private helper methods to define character classes used in regex patterns
    private static getNonVowelCharsPattern(): string {
        return '[^aeiou]';
    }

    private static getVowelCharsPattern(): string {
        return '[aeiouy]';
    }

    private static getNonVowelSequencePattern(): string {
        return `${PorterStemmer.getNonVowelCharsPattern()}[^aeiouy]*`;
    }

    private static getVowelSequencePattern(): string {
        return `${PorterStemmer.getVowelCharsPattern()}[aeiou]*`;
    }

    private static getMeasureGreaterThanZeroPattern(): string {
        return `^(${PorterStemmer.getNonVowelSequencePattern()})?` +
            `${PorterStemmer.getVowelSequencePattern()}${PorterStemmer.getNonVowelSequencePattern()}`;
    }

    private static getMeasureEqualsOnePattern(): string {
        return `^(${PorterStemmer.getNonVowelSequencePattern()})?${PorterStemmer.getVowelSequencePattern()}` +
            `${PorterStemmer.getNonVowelSequencePattern()}(${PorterStemmer.getVowelSequencePattern()})?$`;
    }

    private static getMeasureGreaterThanOnePattern(): string {
        return `^(${PorterStemmer.getNonVowelSequencePattern()})?${PorterStemmer.getVowelSequencePattern()}` +
            `${PorterStemmer.getNonVowelSequencePattern()}${PorterStemmer.getVowelSequencePattern()}${PorterStemmer.getNonVowelSequencePattern()}`;
    }

    private static getHasVowelPattern(): string {
        return `^(${PorterStemmer.getNonVowelSequencePattern()})?${PorterStemmer.getVowelCharsPattern()}`;
    }

    private static getSuffixMappingsStep2(): Record<string, string> {
        // Mappings for step 2
        return {
            'ational' : 'ate',
            'tional' : 'tion',
            'enci' : 'ence',
            'anci' : 'ance',
            'izer' : 'ize',
            'bli' : 'ble',
            'alli' : 'al',
            'entli' : 'ent',
            'eli' : 'e',
            'ousli' : 'ous',
            'ization' : 'ize',
            'ation' : 'ate',
            'ator' : 'ate',
            'alism' : 'al',
            'iveness' : 'ive',
            'fulness' : 'ful',
            'ousness' : 'ous',
            'aliti' : 'al',
            'iviti' : 'ive',
            'biliti' : 'ble',
            'logi' : 'log'
          };
    }

    private static suffixMappingsStep3(): Record<string, string> {
        return {
            'icate': 'ic',
            'ative': '',
            'alize': 'al',
            'iciti': 'ic',
            'ical': 'ic',
            'ful': '',
            'ness': ''
        };
    }

    private static normalizeWord(word: string): string {
        const firstChar = word.charAt(0);
        if (firstChar === 'y') {
            word = firstChar.toUpperCase() + word.substr(1);
        }
        return word.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    }

    private static applyStep1a(word: string): string {
        let re = /^(.+?)(ss|i)es$/;
        let re2 = /^(.+?)([^s])s$/;
        if (re.test(word)) { 
            word = word.replace(re, '$1$2'); 
        } else if (re2.test(word)) {
            word = word.replace(re2, '$1$2'); 
        }
        return word;
    }

    private static applyStep1b(word: string): string {
        let re = /^(.+?)eed$/;
        let re2 = /^(.+?)(ed|ing)$/;
        if (re.test(word)) {
          let fp = re.exec(word);
          re = new RegExp(PorterStemmer.getMeasureGreaterThanZeroPattern());
          if (re.test(fp[1])) {
            re = /.$/;
            word = word.replace(re, '');
          }
        } else if (re2.test(word)) {
          let fp = re2.exec(word);
          let stem = fp[1];
          re2 = new RegExp(PorterStemmer.getHasVowelPattern());
          if (re2.test(stem)) {
            word = stem;
            re2 = /(at|bl|iz)$/;
            let re3 = new RegExp('([^aeiouylsz])\\1$');
            let re4 = new RegExp(`^${PorterStemmer.getNonVowelSequencePattern()}` + 
                `${PorterStemmer.getVowelSequencePattern()}[^aeiouwxy]$`);
    
            if (re2.test(word)) { 
              word += 'e'; 
            } else if (re3.test(word)) { 
              re = /.$/; 
              word = word.replace(re,''); 
            } else if (re4.test(word)) { 
                word += 'e'; 
            }
          }
        }
        return word;
    }

    private static applyStep1c(word: string): string {
        let re = new RegExp(`^(.*${PorterStemmer.getVowelCharsPattern()}.*)y$`);
        if (re.test(word)) {
          let fp = re.exec(word);
          let stem = fp[1];
          word = stem + 'i';
        }
        return word;
    }

    private static applyStep2(word: string): string  {
        let re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (re.test(word)) {
          let fp = re.exec(word);
          let stem = fp[1];
          let suffix = fp[2];
          re = new RegExp(PorterStemmer.getMeasureGreaterThanZeroPattern());
          if (re.test(stem)) {
            word = stem + PorterStemmer.getSuffixMappingsStep2()[suffix];
          }
        }
        return word;
    }

    private static applyStep3(word: string): string {
        let re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (re.test(word)) {
          let fp = re.exec(word);
          let stem = fp[1];
          let suffix = fp[2];
          re = new RegExp(PorterStemmer.getMeasureGreaterThanZeroPattern());
          if (re.test(stem)) {
            word = stem + PorterStemmer.suffixMappingsStep3()[suffix];
          }
        }
        return word;
    }

    private static applyStep4(word: string): string {
        let re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        let re2 = /^(.+?)(s|t)(ion)$/;
        if (re.test(word)) {
          let fp = re.exec(word);
          let stem = fp[1];
          re = new RegExp(PorterStemmer.getMeasureGreaterThanOnePattern());
          if (re.test(stem)) {
            word = stem;
          }
        } else if (re2.test(word)) {
          let fp = re2.exec(word);
          let stem = fp[1] + fp[2];
          re2 = new RegExp(PorterStemmer.getMeasureGreaterThanOnePattern());
          if (re2.test(stem)) {
            word = stem;
          }
        }
        return word;
    }

    private static applyStep5(word: string): string  {
        let re = /^(.+?)e$/;
        if (re.test(word)) {
          let fp = re.exec(word);
          let stem = fp[1];
          re = new RegExp(PorterStemmer.getMeasureGreaterThanOnePattern());
          let re2 = new RegExp(PorterStemmer.getMeasureGreaterThanOnePattern());
          let re3 = new RegExp(`^${PorterStemmer.getNonVowelSequencePattern()}` + 
            `${PorterStemmer.getVowelCharsPattern()}[^aeiouwxy]$`);
          if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
            word = stem;
          }
        }
        re = /ll$/;
        let re2 = new RegExp(PorterStemmer.getMeasureGreaterThanOnePattern());
        if (re.test(word) && re2.test(word)) {
          re = /.$/;
          word = word.replace(re, '');
        }
        return word;
    }

    public static stem(word: string): string {
        if (word.length < 3) { return word; }

        word = PorterStemmer.normalizeWord(word);
        word = PorterStemmer.applyStep1a(word);
        word = PorterStemmer.applyStep1b(word);
        word = PorterStemmer.applyStep1c(word);
        word = PorterStemmer.applyStep2(word);
        word = PorterStemmer.applyStep3(word);
        word = PorterStemmer.applyStep4(word);
        word = PorterStemmer.applyStep5(word);

        return word;
    }

    public static async stemAsync(word: string): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const stemmedWord = PorterStemmer.stem(word);
                resolve(stemmedWord);
            } catch (error) {
                reject(error);
            }
        });
    }
}
