export interface WordForm {
  pos: string;
  word: string;
}

export interface WordData {
  id: string;
  word: string;
  syllables: string[];
  stressedSyllableIndex: number; // Index of the syllable that is stressed (0-based)
  phonetic: string;
  pos: string; // Part of speech (n., v., adj.)
  definitionCN: string;
  definitionEN: string;
  synonyms: string[];
  antonyms: string[];
  sentenceEN: string;
  sentenceCN: string;
  forms?: WordForm[]; // Related word forms (e.g. verb, noun, adjective)
}

export interface SubCategory {
  id: string;
  name: string;
  groups: WordGroup[];
}

export interface WordGroup {
  id: string;
  name: string;
  words: WordData[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export enum LearningStep {
  Listen = 0,
  Input1 = 1, // Copy 1
  Input2 = 2, // Copy 2
  Input3 = 3, // Blind Dictation
  Sentence = 4, // Sentence Dictation
  CustomSentence = 5, // Create your own sentence
  Completed = 6
}