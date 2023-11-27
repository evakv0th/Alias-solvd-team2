class LanguageProcessing 
{

    private static getNonVowelCharsPattern(): string 
    {
        return '[^aeiou]';
    }

    private static getVowelCharsPattern(): string 
    {
        return '[aeiouy]';
    }

    private static getNonVowelSequencePattern(): string 
    {
        return `${LanguageProcessing.getNonVowelCharsPattern()}[^aeiouy]*`;
    }

    private static getVowelSequencePattern(): string 
    {
        return `${LanguageProcessing.getVowelCharsPattern()}[aeiou]*`;
    }

    private static getMeasureGreaterThanZeroPattern(): string 
    {
        return `^(${LanguageProcessing.getNonVowelSequencePattern()})?` +
            `${LanguageProcessing.getVowelSequencePattern()}${LanguageProcessing.getNonVowelSequencePattern()}`;
    }

    private static getMeasureEqualsOnePattern(): string 
    {
        return `^(${LanguageProcessing.getNonVowelSequencePattern()})?${LanguageProcessing.getVowelSequencePattern()}` +
            `${LanguageProcessing.getNonVowelSequencePattern()}(${LanguageProcessing.getVowelSequencePattern()})?$`;
    }

    private static getMeasureGreaterThanOnePattern(): string 
    {
        return `^(${LanguageProcessing.getNonVowelSequencePattern()})?${LanguageProcessing.getVowelSequencePattern()}` +
            `${LanguageProcessing.getNonVowelSequencePattern()}${LanguageProcessing.getVowelSequencePattern()}${LanguageProcessing.getNonVowelSequencePattern()}`;
    }

    private static getHasVowelPattern(): string 
    {
        return `^(${LanguageProcessing.getNonVowelSequencePattern()})?${LanguageProcessing.getVowelCharsPattern()}`;
    }

    private static getSuffixMappingsStep2(): Record<string, string> 
    {
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

    private static suffixMappingsStep3(): Record<string, string> 
    {
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

    private static normalizeWord(word: string): string 
    {
        const firstChar = word.substring(0, 1);

        if (firstChar === 'y') 
        {
            word = firstChar.toUpperCase() + word.substring(1);
        }

        return word.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    }

    private static applyStep1a(word: string): string 
    {
        const re = /^(.+?)(ss|i)es$/;
        const re2 = /^(.+?)([^s])s$/;

        if (re.test(word)) 
        { 
            word = word.replace(re, '$1$2'); 
        } 
        else if (re2.test(word)) 
        {
            word = word.replace(re2, '$1$2'); 
        }

        return word;
    }

    private static applyStep1b(word: string): string 
    {
        const re = /^(.+?)eed$/;
        const re2 = /^(.+?)(ed|ing)$/;
        const match = re.exec(word);

        if (match) 
        {
            const stem = match[1];
            const measurePattern = new RegExp(LanguageProcessing.getMeasureGreaterThanZeroPattern());
            if (measurePattern.test(stem)) 
            {
                word = stem.replace(/.$/, '');
            }
        } 
        else 
        {
            const match2 = re2.exec(word);
            if (match2) 
            {
                const stem = match2[1];
                const hasVowelPattern = new RegExp(LanguageProcessing.getHasVowelPattern());
                if (hasVowelPattern.test(stem)) 
                {
                    word = stem;
                    if (/(at|bl|iz)$/.test(word)) 
                    { 
                        word += 'e'; 
                    } 
                    else if (new RegExp('([^aeiouylsz])\\1$').test(word)) 
                    { 
                        word = word.replace(/.$/, ''); 
                    } 
                    else if (new RegExp(`^${LanguageProcessing.getNonVowelSequencePattern()}${LanguageProcessing.getVowelSequencePattern()}[^aeiouwxy]$`).test(word)) 
                    { 
                        word += 'e'; 
                    }
                }
            }
        }
        
        return word;
    }


    private static applyStep1c(word: string): string 
    {
        const re = new RegExp(`^(.*${LanguageProcessing.getVowelCharsPattern()}.*)y$`);
        const match = re.exec(word);

        if (match) 
        {
            const stem = match[1];
            word = stem + 'i';
        }

        return word;
    }

    private static applyStep2(word: string): string  
    {
        const re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        const match = re.exec(word);

        if (match) 
        {
            const stem = match[1];
            const suffix = match[2];
            const reMeasure = new RegExp(LanguageProcessing.getMeasureGreaterThanZeroPattern());
            if (reMeasure.test(stem)) 
            {
                word = stem + LanguageProcessing.getSuffixMappingsStep2()[suffix];
            }
        }

        return word;
    }

    private static applyStep3(word: string): string 
    {
        const re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        const match = re.exec(word);

        if (match) 
        {
            const stem = match[1];
            const suffix = match[2];
            const reMeasure = new RegExp(LanguageProcessing.getMeasureGreaterThanZeroPattern());
            if (reMeasure.test(stem)) 
            {
                word = stem + LanguageProcessing.suffixMappingsStep3()[suffix];
            }
        }

        return word;
    }

    private static applyStep4(word: string): string 
    {
        const re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        const re2 = /^(.+?)(s|t)(ion)$/;
        let match = re.exec(word);

        if (match) 
        {
            const stem = match[1];
            const reMeasure = new RegExp(LanguageProcessing.getMeasureGreaterThanOnePattern());
            if (reMeasure.test(stem)) 
            {
                word = stem;
            }
        } 
        else 
        {
            match = re2.exec(word);
            if (match) 
            {
                const stem = match[1] + match[2];
                const reMeasure = new RegExp(LanguageProcessing.getMeasureGreaterThanOnePattern());
                if (reMeasure.test(stem)) 
                {
                    word = stem;
                }
            }
        }

        return word;
    }

    private static applyStep5(word: string): string  
    {
        const re = /^(.+?)e$/;
        const match = re.exec(word);

        if (match) 
        {
            const stem = match[1];
            const reMeasure = new RegExp(LanguageProcessing.getMeasureGreaterThanOnePattern());
            const reMeasureOne = new RegExp(LanguageProcessing.getMeasureEqualsOnePattern());
            const reCvc = new RegExp(`^${LanguageProcessing.getNonVowelSequencePattern()}${LanguageProcessing.getVowelCharsPattern()}[^aeiouwxy]$`);
            if (reMeasure.test(stem) || (reMeasureOne.test(stem) && !reCvc.test(stem))) 
            {
                word = stem;
            }
        }

        const reLl = /ll$/;
        const reMeasure = new RegExp(LanguageProcessing.getMeasureGreaterThanOnePattern());

        if (reLl.test(word) && reMeasure.test(word)) 
        {
            word = word.replace(/.$/, '');
        }
        return word;
    }

    public static stem(word: string): string 
    {
        if (word.length < 3) 
        { 
            return word; 
        }

        word = LanguageProcessing.normalizeWord(word);
        word = LanguageProcessing.applyStep1a(word);
        word = LanguageProcessing.applyStep1b(word);
        word = LanguageProcessing.applyStep1c(word);
        word = LanguageProcessing.applyStep2(word);
        word = LanguageProcessing.applyStep3(word);
        word = LanguageProcessing.applyStep4(word);
        word = LanguageProcessing.applyStep5(word);

        return word;
    }

    public static async stemAsync(word: string): Promise<string> 
    {
        return new Promise((resolve, reject) => {
            try 
            {
                const stemmedWord = LanguageProcessing.stem(word);
                resolve(stemmedWord);
            } 
            catch (error) 
            {
                reject(error);
            }
        });
    }
}

export { LanguageProcessing };