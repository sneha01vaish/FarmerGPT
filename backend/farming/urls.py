from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    get_current_user,
    FarmerProfileView,
    CropViewSet,
    get_weather,
    get_crop_suggestions,
    chatbot
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'crops', CropViewSet, basename='crop')

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', get_current_user, name='current_user'),

    # Profile
    path('profile/', FarmerProfileView.as_view(), name='farmer_profile'),

    # Weather
    path('weather/', get_weather, name='weather'),

    # Crop Suggestions
    path('suggestions/', get_crop_suggestions, name='crop_suggestions'),

    # Chatbot
    path('chatbot/', chatbot, name='chatbot'),

    # Crops (via router)
    path('', include(router.urls)),
]
