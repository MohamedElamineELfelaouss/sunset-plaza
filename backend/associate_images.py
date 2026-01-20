"""Script to associate images with listings"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.content.models import SiteContent, ContentImage

# Associate images with listings
listings = SiteContent.objects.filter(content_type='OFFICE').order_by('id')

images_map = {
    "Bureau Exécutif Vue Mer": "content_images/bureau_executif_vue_mer.png",
    "Open Space Moderne": "content_images/open_space_moderne.png",
}

for listing in listings:
    if listing.title in images_map:
        ContentImage.objects.create(
            content=listing,
            image=images_map[listing.title],
            caption=listing.title,
            order=0
        )
        print(f"✓ Associated image with: {listing.title}")
    else:
        print(f"○ No image for: {listing.title}")

print("\nDone!")
