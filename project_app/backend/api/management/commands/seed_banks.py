from django.core.management.base import BaseCommand
from api.models import MockBank

class Command(BaseCommand):
    help = 'Seeds mock banks for Open Banking simulation'

    def handle(self, *args, **options):
        banks = [
            {
                'name_ar': 'مصرف الراجحي',
                'name_en': 'Al Rajhi Bank',
                'code': 'rajhi',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Al_Rajhi_Bank_Logo.svg',
                'color': '#005CA9' # Rajhi Blue
            },
            {
                'name_ar': 'البنك الأهلي السعودي (SNB)',
                'name_en': 'Saudi National Bank',
                'code': 'snb',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/SNB_Logo_Saudi_National_Bank.svg',
                'color': '#007A3E' # SNB Green
            },
            {
                'name_ar': 'بنك الرياض',
                'name_en': 'Riyad Bank',
                'code': 'riyad',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Riyad_Bank_Logo.svg',
                'color': '#FF9E1B' # Riyad Orange/Gold
            },
            {
                'name_ar': 'مصرف الإنماء',
                'name_en': 'Alinma Bank',
                'code': 'alinma',
                'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Alinma_Bank_Logo.svg',
                'color': '#A27B38' # Alinma Bronze/Gold
            }
        ]

        for bank_data in banks:
            bank, created = MockBank.objects.update_or_create(
                code=bank_data['code'],
                defaults=bank_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created bank: {bank.name_ar}"))
            else:
                self.stdout.write(self.style.WARNING(f"Updated bank: {bank.name_ar}"))
