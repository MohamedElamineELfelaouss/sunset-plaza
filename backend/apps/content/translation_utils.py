"""
Translation Utility for SiteContent.
Uses DeepL for most languages, and Google Translate (via deep-translator) for Arabic.
"""
import os
import deepl
from deep_translator import GoogleTranslator
from django.conf import settings


def get_deepl_translator():
    """Get DeepL translator instance."""
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise ValueError("DEEPL_API_KEY not found in environment variables")
    return deepl.Translator(api_key)


# Map our language codes to DeepL language codes
DEEPL_LANGUAGE_MAP = {
    'fr': 'FR',
    'en': 'EN-GB',
    'es': 'ES',
    'nl': 'NL',
    'de': 'DE',
    'it': 'IT',
    'pt': 'PT-PT',
}

# Languages that need Google Translate (DeepL doesn't support them)
GOOGLE_ONLY_LANGUAGES = ['ar']


def translate_with_deepl(text: str, target_lang: str, source_lang: str = 'FR') -> str:
    """Translate using DeepL API."""
    deepl_target = DEEPL_LANGUAGE_MAP.get(target_lang)
    if not deepl_target:
        return text
    
    try:
        translator = get_deepl_translator()
        result = translator.translate_text(text, source_lang=source_lang, target_lang=deepl_target)
        return result.text
    except Exception as e:
        print(f"DeepL translation error for {target_lang}: {e}")
        return text


def translate_with_google(text: str, target_lang: str, source_lang: str = 'fr') -> str:
    """Translate using Google Translate (free, via deep-translator)."""
    try:
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Google translation error for {target_lang}: {e}")
        return text


def translate_text(text: str, target_lang: str, source_lang: str = 'fr') -> str:
    """
    Translate text using the best available translator.
    - DeepL for EN, ES, NL, DE, IT, PT (higher quality)
    - Google for AR (DeepL doesn't support Arabic)
    """
    if not text or not text.strip():
        return text
    
    # Use Google Translate for Arabic
    if target_lang in GOOGLE_ONLY_LANGUAGES:
        return translate_with_google(text, target_lang, source_lang)
    
    # Use DeepL for other languages
    return translate_with_deepl(text, target_lang, source_lang.upper())


def auto_translate_content(instance, fields=None):
    """
    Auto-translate all translatable fields of a SiteContent instance.
    
    Args:
        instance: SiteContent model instance
        fields: List of field names to translate (default: title, description, location)
    """
    if fields is None:
        fields = ['title', 'description', 'location']
    
    # Get all configured languages except the default (French)
    target_languages = [lang[0] for lang in settings.LANGUAGES if lang[0] != 'fr']
    
    for field in fields:
        # Get the French (source) value
        source_value = getattr(instance, f'{field}_fr', None)
        if not source_value:
            continue
        
        for lang in target_languages:
            # Check if translation already exists
            existing = getattr(instance, f'{field}_{lang}', None)
            if existing:
                continue  # Don't overwrite existing translations
            
            # Translate
            translated = translate_text(source_value, lang)
            setattr(instance, f'{field}_{lang}', translated)
    
    return instance
