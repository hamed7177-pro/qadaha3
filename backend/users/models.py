from django.db import models

class User(models.Model):
    full_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)

    def str(self):
        return self.full_name