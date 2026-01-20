from modeltranslation.translator import translator, TranslationOptions
from .models import SiteContent


class SiteContentTranslationOptions(TranslationOptions):
    """
    Define which fields of SiteContent should be translatable.
    This will create title_fr, title_en, title_ar, etc. columns in the database.
    """
    fields = ('title', 'description', 'location')


translator.register(SiteContent, SiteContentTranslationOptions)
