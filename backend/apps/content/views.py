from django.db import models as db_models
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from .models import SiteContent, ContentImage
from .serializers import SiteContentSerializer, AdminSiteContentSerializer, ContentImageSerializer


class PublicContentListView(generics.ListAPIView):
    """
    GET /api/content/
    Fetches all 'PUBLISHED' content for the public frontend
    """
    serializer_class = SiteContentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return SiteContent.objects.filter(status=SiteContent.Status.PUBLISHED).order_by("-updated_at")


class PublicContentDetailView(generics.RetrieveAPIView):
    """
    GET /api/content/<pk>/
    Fetches a single published content item
    """
    queryset = SiteContent.objects.filter(status=SiteContent.Status.PUBLISHED)
    serializer_class = SiteContentSerializer
    permission_classes = [permissions.AllowAny]


# ==================== ADMIN ENDPOINTS ====================

class AdminContentListCreateView(generics.ListCreateAPIView):
    """
    GET /api/content/admin/ - List ALL content (drafts + published)
    POST /api/content/admin/ - Create new content
    """
    queryset = SiteContent.objects.all().order_by('-created_at')
    serializer_class = AdminSiteContentSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser


class AdminContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/DELETE /api/content/admin/<pk>/
    View, update, or delete content
    """
    queryset = SiteContent.objects.all()
    serializer_class = AdminSiteContentSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser


@api_view(['PATCH'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def toggle_publish_status(request, pk):
    """
    PATCH /api/content/admin/<pk>/publish/
    Toggle between DRAFT and PUBLISHED
    """
    try:
        content = SiteContent.objects.get(pk=pk)
    except SiteContent.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if content.status == SiteContent.Status.PUBLISHED:
        new_status = SiteContent.Status.DRAFT
    else:
        new_status = SiteContent.Status.PUBLISHED
    
    SiteContent.objects.filter(pk=pk).update(status=new_status)
    content.refresh_from_db()
    return Response({
        "id": content.id,
        "status": content.status,
        "message": f"Content is now {content.get_status_display()}"
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def content_stats(request):
    """
    GET /api/content/admin/stats/
    Get content statistics for dashboard
    """
    total = SiteContent.objects.count()
    published = SiteContent.objects.filter(status='PUBLISHED').count()
    draft = SiteContent.objects.filter(status='DRAFT').count()
    
    # By deal type
    rent = SiteContent.objects.filter(deal_type='RENT').count()
    buy = SiteContent.objects.filter(deal_type='BUY').count()
    invest = SiteContent.objects.filter(deal_type='INVEST').count()
    
    return Response({
        'total': total,
        'published': published,
        'draft': draft,
        'by_deal_type': {
            'rent': rent,
            'buy': buy,
            'invest': invest,
        }
    })


# ==================== IMAGE MANAGEMENT ====================

class ContentImageUploadView(APIView):
    """
    POST /api/content/admin/<pk>/images/
    Upload one or more images for a content item
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAdminUser
    
    def post(self, request, pk):
        try:
            content = SiteContent.objects.get(pk=pk)
        except SiteContent.DoesNotExist:
            return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)
        
        files = request.FILES.getlist('images')
        if not files:
            # Check for single 'image' field
            if 'image' in request.FILES:
                files = [request.FILES['image']]
            else:
                return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get current max order
        max_order = content.images.aggregate(db_models.Max('order'))['order__max'] or 0
        
        created_images = []
        for idx, file in enumerate(files):
            caption = request.data.get('caption', '')
            img = ContentImage.objects.create(
                content=content,
                image=file,
                caption=caption,
                order=max_order + idx + 1
            )
            created_images.append(img)
        
        # Also set first image as main image if content has no main image
        if not content.image and created_images:
            SiteContent.objects.filter(pk=pk).update(image=created_images[0].image.name)
        
        serializer = ContentImageSerializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get(self, request, pk):
        """GET /api/content/admin/<pk>/images/ - List all images"""
        try:
            content = SiteContent.objects.get(pk=pk)
        except SiteContent.DoesNotExist:
            return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ContentImageSerializer(content.images.all(), many=True)
        return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def delete_content_image(request, pk, image_id):
    """
    DELETE /api/content/admin/<pk>/images/<image_id>/
    Delete a specific image from content
    """
    try:
        content = SiteContent.objects.get(pk=pk)
        image = content.images.get(pk=image_id)
    except (SiteContent.DoesNotExist, ContentImage.DoesNotExist):
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # If this was the main image, set another one
    if content.image and image.image.name == content.image.name:
        remaining = content.images.exclude(pk=image_id).first()
        new_image = remaining.image.name if remaining else None
        SiteContent.objects.filter(pk=pk).update(image=new_image)
    
    image.delete()
    return Response({"message": "Image deleted"}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def reorder_content_images(request, pk):
    """
    PATCH /api/content/admin/<pk>/images/reorder/
    Reorder images. Expects: {"order": [id1, id2, id3, ...]}
    """
    try:
        content = SiteContent.objects.get(pk=pk)
    except SiteContent.DoesNotExist:
        return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)
    
    order_list = request.data.get('order', [])
    if not order_list:
        return Response({"error": "Order list required"}, status=status.HTTP_400_BAD_REQUEST)
    
    for idx, image_id in enumerate(order_list):
        try:
            img = content.images.get(pk=image_id)
            img.order = idx
            img.save()
        except ContentImage.DoesNotExist:
            pass
    
    # Set first image as main
    first_img = content.images.first()
    if first_img:
        SiteContent.objects.filter(pk=pk).update(image=first_img.image.name)
    
    serializer = ContentImageSerializer(content.images.all(), many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def set_main_image(request, pk, image_id):
    """
    PATCH /api/content/admin/<pk>/images/<image_id>/main/
    Set a specific image as the main image AND reorder images so it's first
    """
    try:
        content = SiteContent.objects.get(pk=pk)
        selected_image = content.images.get(pk=image_id)
    except (SiteContent.DoesNotExist, ContentImage.DoesNotExist):
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # 1. Update the main image on SiteContent
    SiteContent.objects.filter(pk=pk).update(image=selected_image.image.name)
    
    # 2. ALSO reorder ContentImage objects so selected image is first (order=0)
    # Get all images sorted by current order
    all_images = list(content.images.all().order_by('order'))
    
    # Remove selected image from its current position
    all_images = [img for img in all_images if img.id != image_id]
    
    # Insert selected image at the beginning
    all_images.insert(0, selected_image)
    
    # Update order field for ALL images
    for idx, img in enumerate(all_images):
        if img.order != idx:
            ContentImage.objects.filter(pk=img.id).update(order=idx)
    
    return Response({
        "message": "Main image updated",
        "image_id": image_id,
        "new_order": [img.id for img in all_images]
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # TODO: Change to IsAdminUser
def auto_translate_content_view(request, pk):
    """
    POST /api/content/admin/<pk>/translate/
    Auto-translate content from French to all other languages using DeepL/Google Translate.
    """
    from .translation_utils import auto_translate_content
    
    try:
        content = SiteContent.objects.get(pk=pk)
    except SiteContent.DoesNotExist:
        return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if French content exists
    if not content.title_fr:
        return Response({
            "error": "Le contenu français (titre) est requis pour la traduction"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Run auto translation (modifies instance in memory)
        auto_translate_content(content)
        
        # Use update() to save all translation fields - bypasses django-modeltranslation save() issue
        update_data = {}
        for field in ['title', 'description', 'location']:
            for lang in ['en', 'ar', 'es', 'nl', 'de', 'it', 'pt']:
                field_name = f'{field}_{lang}'
                value = getattr(content, field_name, None)
                if value:
                    update_data[field_name] = value
        
        if update_data:
            SiteContent.objects.filter(pk=pk).update(**update_data)
        
        return Response({
            "message": "✅ Traduction automatique réussie vers 7 langues (EN, AR, ES, NL, DE, IT, PT)",
            "translated_fields": ["title", "description", "location"]
        })
    except ValueError as e:
        return Response({
            "error": f"Erreur de configuration: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({
            "error": f"Erreur de traduction: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
