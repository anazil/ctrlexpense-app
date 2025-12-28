from django.core.management.base import BaseCommand
from api.models import Category

class Command(BaseCommand):
    help = 'Populate categories table with default categories'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Food', 'emoji': '🍔', 'color': '#ffebee'},
            {'name': 'Travel', 'emoji': '🚕', 'color': '#e3f2fd'},
            {'name': 'Fun', 'emoji': '🎮', 'color': '#f3e5f5'},
            {'name': 'Shopping', 'emoji': '🛒', 'color': '#e8f5e8'},
            {'name': 'Health', 'emoji': '💊', 'color': '#fff3e0'},
            {'name': 'Education', 'emoji': '📚', 'color': '#fce4ec'},
            {'name': 'Bills', 'emoji': '💡', 'color': '#e1f5fe'},
            {'name': 'Salary', 'emoji': '💰', 'color': '#e8f5e8'},
            {'name': 'Investment', 'emoji': '📈', 'color': '#f1f8e9'},
            {'name': 'Gift', 'emoji': '🎁', 'color': '#fce4ec'},
        ]

        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'emoji': cat_data['emoji'],
                    'color': cat_data['color']
                }
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
            else:
                self.stdout.write(f'Category already exists: {category.name}')

        self.stdout.write(self.style.SUCCESS('Successfully populated categories'))