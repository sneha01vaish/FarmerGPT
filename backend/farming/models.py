from django.db import models
from django.contrib.auth.models import User

class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    land_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Land size in acres")
    experience_years = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        verbose_name = "Farmer Profile"
        verbose_name_plural = "Farmer Profiles"


class Crop(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('planted', 'Planted'),
        ('growing', 'Growing'),
        ('harvested', 'Harvested'),
    ]

    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='crops')
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True, null=True)
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Area in acres")
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.user.username}"

    class Meta:
        verbose_name = "Crop"
        verbose_name_plural = "Crops"
        ordering = ['-created_at']
