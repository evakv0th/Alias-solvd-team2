export interface IVocabulary {
  _id: string | undefined;
  words: string[];
}

export interface IVocabularyCreateSchema {
  words: string[];
}
