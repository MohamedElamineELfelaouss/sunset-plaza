"""Script to associate stock images with all listings"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.content.models import SiteContent, ContentImage

# Clear existing images
ContentImage.objects.all().delete()
print("Cleared existing images")

# Get all listings
listings = list(SiteContent.objects.filter(content_type='OFFICE').order_by('id'))
print(f"Found {len(listings)} listings")

# Stock images to assign (using both generated and downloaded)
stock_images = [
    "content_images/bureau_executif_vue_mer.png",  # 1
    "content_images/open_space_moderne.png",        # 2
    "content_images/office_1.jpg",                  # 3
    "content_images/office_2.jpg",                  # 4
    "content_images/office_3.jpg",                  # 5
    "content_images/office_4.jpg",                  # 6
    "content_images/office_5.jpg",                  # 7
    "content_images/office_6.jpg",                  # 8
    "content_images/office_7.jpg",                  # 9
    "content_images/office_8.jpg",                  # 10
    "content_images/office_9.jpg",                  # 11
    "content_images/office_10.jpg",                 # 12
]

# Assign each listing an image (cycling if needed)
for i, listing in enumerate(listings):
    image_path = stock_images[i % len(stock_images)]
    
    # Check if image exists
    full_path = os.path.join('media', image_path)
    if os.path.exists(full_path):
        ContentImage.objects.create(
            content=listing,
            image=image_path,
            caption=listing.title,
            order=0
        )
        print(f"✓ {listing.title} -> {image_path}")
    else:
        print(f"✗ Image not found: {full_path}")

print(f"\n✅ Done! Associated images with {len(listings)} listings.")
