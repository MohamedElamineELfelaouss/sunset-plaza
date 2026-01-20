"""
Script to update all listings with realistic professional content
for a real estate website in Casablanca, Morocco
"""
import os
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.content.models import SiteContent, ContentImage

# Define realistic listings data for a luxury office building in Casablanca
REALISTIC_LISTINGS = [
    {
        "title": "Bureau Exécutif Vue Mer",
        "location": "Tour A - Étage 22",
        "description": "Bureau de standing avec vue panoramique sur l'océan Atlantique. Finitions haut de gamme, climatisation individuelle, câblage réseau Cat6. Idéal pour cabinet d'avocats ou société de conseil.",
        "deal_type": "RENT",
        "price": 18500,
        "surface_area": 85,
    },
    {
        "title": "Open Space Moderne",
        "location": "Tour B - Étage 8",
        "description": "Espace de travail ouvert et lumineux, parfait pour startup ou agence créative. Configuration flexible, grandes baies vitrées, espaces de collaboration intégrés.",
        "deal_type": "RENT",
        "price": 25000,
        "surface_area": 180,
    },
    {
        "title": "Suite Présidentielle",
        "location": "Tour A - Étage 30",
        "description": "Le summum du prestige professionnel. Suite de direction avec salon privé, salle de réunion attenante et terrasse avec vue à 360° sur Casablanca. Accès VIP dédié.",
        "deal_type": "RENT",
        "price": 45000,
        "surface_area": 250,
    },
    {
        "title": "Bureau Compact Entrepreneur",
        "location": "Tour B - Étage 3",
        "description": "Solution idéale pour entrepreneurs et freelances. Bureau fonctionnel avec accès aux espaces communs premium. Services de secrétariat disponibles.",
        "deal_type": "RENT",
        "price": 6500,
        "surface_area": 35,
    },
    {
        "title": "Plateau de Bureaux Divisible",
        "location": "Tour A - Étage 15",
        "description": "Grand plateau entièrement aménageable selon vos besoins. Possibilité de division en plusieurs unités. Idéal pour siège social ou centre d'appels.",
        "deal_type": "RENT",
        "price": 65000,
        "surface_area": 450,
    },
    {
        "title": "Cabinet Médical Premium",
        "location": "Tour B - Étage 1",
        "description": "Local aménagé aux normes médicales. Salle d'attente, deux cabinets de consultation, sanitaires adaptés. Accès direct depuis le parking.",
        "deal_type": "RENT",
        "price": 22000,
        "surface_area": 120,
    },
    {
        "title": "Bureau d'Angle Lumineux",
        "location": "Tour A - Étage 18",
        "description": "Double exposition Est-Ouest garantissant une luminosité optimale toute la journée. Parfait pour architectes, designers ou créatifs.",
        "deal_type": "RENT",
        "price": 15000,
        "surface_area": 95,
    },
    {
        "title": "Investissement Locatif - Lot de 3 Bureaux",
        "location": "Tour B - Étages 5-6",
        "description": "Opportunité d'investissement rare. Trois bureaux loués avec baux fermes, rendement net de 7.2%. Locataires de qualité (banque, assurance, consulting).",
        "deal_type": "INVEST",
        "price": 2800000,
        "surface_area": 280,
    },
    {
        "title": "Penthouse Corporate",
        "location": "Tour A - Étage 32",
        "description": "Exclusivité absolue au dernier étage. Espace de réception, bureaux de direction, terrasse privative de 80m². Une adresse unique à Casablanca.",
        "deal_type": "BUY",
        "price": 12500000,
        "surface_area": 380,
    },
    {
        "title": "Espace Coworking Clé en Main",
        "location": "Tour B - Étage 10",
        "description": "Espace coworking entièrement équipé et opérationnel. 45 postes de travail, 3 salles de réunion, cuisine commune. Clientèle fidèle existante.",
        "deal_type": "BUY",
        "price": 4200000,
        "surface_area": 320,
    },
    {
        "title": "Bureau Standing Anfa",
        "location": "Tour A - Étage 12",
        "description": "Bureau de représentation dans le quartier d'affaires le plus prisé. Finitions marbre et bois précieux. Adresse de prestige pour votre entreprise.",
        "deal_type": "RENT",
        "price": 28000,
        "surface_area": 145,
    },
    {
        "title": "Local Commercial RDC",
        "location": "Rez-de-chaussée - Façade principale",
        "description": "Vitrine exceptionnelle sur le boulevard principal. Idéal pour showroom, agence bancaire ou boutique haut de gamme. Fort passage piéton.",
        "deal_type": "RENT",
        "price": 55000,
        "surface_area": 200,
    },
]

def update_listings():
    """Update existing listings or create new ones with realistic content"""
    
    # Delete all existing OFFICE content
    deleted = SiteContent.objects.filter(content_type='OFFICE').delete()
    print(f"Deleted {deleted[0]} existing listings")
    
    # Also delete old images
    ContentImage.objects.all().delete()
    print("Cleared old images")
    
    # Create new listings
    for i, data in enumerate(REALISTIC_LISTINGS):
        space = SiteContent.objects.create(
            content_type='OFFICE',
            status='PUBLISHED',
            title=data["title"],
            location=data["location"],
            description=data["description"],
            deal_type=data["deal_type"],
            price=data["price"],
            surface_area=data["surface_area"],
        )
        print(f"✓ Created: {data['title']}")
    
    print(f"\n✅ Done! {len(REALISTIC_LISTINGS)} realistic listings created.")

if __name__ == "__main__":
    update_listings()
