from django.contrib import admin
from .models import FarmerProfile, Crop

@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'location', 'created_at')
    search_fields = ('user__username', 'user__email', 'location')

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'farmer', 'planting_date', 'expected_harvest_date', 'status')
    list_filter = ('status', 'planting_date')
    search_fields = ('name', 'farmer__user__username')
