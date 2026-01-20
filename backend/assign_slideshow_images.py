"""Script to assign 3 images per listing for slideshow feature"""
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

# All available images
all_images = [
    "content_images/bureau_executif_vue_mer.png",
    "content_images/open_space_moderne.png",
    "content_images/office_1.jpg",
    "content_images/office_2.jpg",
    "content_images/office_3.jpg",
    "content_images/office_4.jpg",
    "content_images/office_5.jpg",
    "content_images/office_6.jpg",
    "content_images/office_7.jpg",
    "content_images/office_8.jpg",
    "content_images/office_9.jpg",
    "content_images/office_10.jpg",
    "content_images/office_11.jpg",
    "content_images/office_12.jpg",
    "content_images/office_13.jpg",
    "content_images/office_14.jpg",
    "content_images/office_15.jpg",
    "content_images/office_16.jpg",
    "content_images/office_17.jpg",
    "content_images/office_18.jpg",
    "content_images/office_19.jpg",
    "content_images/office_20.jpg",
    "content_images/office_21.jpg",
    "content_images/office_22.jpg",
]

# Filter to only existing images
existing_images = []
for img in all_images:
    if os.path.exists(os.path.join('media', img)):
        existing_images.append(img)
    else:
        print(f"⚠ Image not found: {img}")

print(f"Found {len(existing_images)} existing images")

# Assign 3 images per listing
images_per_listing = 3

for i, listing in enumerate(listings):
    # Get 3 different images for this listing (using modulo to cycle)
    start_idx = (i * images_per_listing) % len(existing_images)
    
    for j in range(images_per_listing):
        img_idx = (start_idx + j) % len(existing_images)
        image_path = existing_images[img_idx]
        
        ContentImage.objects.create(
            content=listing,
            image=image_path,
            caption=f"{listing.title} - Photo {j+1}",
            order=j
        )
    
    print(f"✓ {listing.title}: assigned 3 images")

total = ContentImage.objects.count()
print(f"\n✅ Done! Created {total} ContentImage records ({len(listings)} listings x {images_per_listing} images)")
