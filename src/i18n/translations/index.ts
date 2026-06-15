import es from './es';
import en from './en';
import de from './de';

export type { Translation } from './es';
export type Language = 'es' | 'en' | 'de';

export const translations = { es, en, de };

export const SUPPORTED_LANGUAGES: Language[] = ['es', 'en', 'de'];

export const DEFAULT_LANGUAGE: Language = 'es';
