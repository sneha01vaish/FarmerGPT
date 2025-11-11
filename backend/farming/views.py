from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
import requests
import openai
from .models import FarmerProfile, Crop
from .serializers import (
    UserSerializer,
    FarmerProfileSerializer,
    CropSerializer,
    RegisterSerializer
)

# Authentication Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current logged-in user details"""
    user = request.user
    try:
        profile = user.farmer_profile
        return Response({
            'user': UserSerializer(user).data,
            'profile': FarmerProfileSerializer(profile).data
        })
    except FarmerProfile.DoesNotExist:
        # Create profile if doesn't exist
        profile = FarmerProfile.objects.create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'profile': FarmerProfileSerializer(profile).data
        })


# Farmer Profile Views
class FarmerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = FarmerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = FarmerProfile.objects.get_or_create(user=self.request.user)
        return profile


# Crop Views
class CropViewSet(viewsets.ModelViewSet):
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            farmer_profile = user.farmer_profile
            return Crop.objects.filter(farmer=farmer_profile)
        except FarmerProfile.DoesNotExist:
            return Crop.objects.none()

    def perform_create(self, serializer):
        farmer_profile, created = FarmerProfile.objects.get_or_create(user=self.request.user)
        serializer.save(farmer=farmer_profile)


# Weather API Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weather(request):
    """Get weather data for a location"""
    location = request.query_params.get('location', 'Delhi')
    api_key = settings.WEATHER_API_KEY

    if not api_key:
        return Response({
            'error': 'Weather API key not configured',
            'message': 'Please add WEATHER_API_KEY to .env file'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    try:
        # Current weather
        current_url = f'http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric'
        current_response = requests.get(current_url)
        current_data = current_response.json()

        # Forecast
        forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?q={location}&appid={api_key}&units=metric'
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()

        if current_response.status_code == 200 and forecast_response.status_code == 200:
            return Response({
                'current': {
                    'temperature': current_data['main']['temp'],
                    'feels_like': current_data['main']['feels_like'],
                    'humidity': current_data['main']['humidity'],
                    'pressure': current_data['main']['pressure'],
                    'description': current_data['weather'][0]['description'],
                    'icon': current_data['weather'][0]['icon'],
                    'wind_speed': current_data['wind']['speed'],
                },
                'forecast': forecast_data.get('list', [])[:8],  # Next 24 hours (3-hour intervals)
                'location': location
            })
        else:
            return Response({
                'error': 'Failed to fetch weather data',
                'message': current_data.get('message', 'Unknown error')
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': 'Weather service error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Crop Suggestions Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_crop_suggestions(request):
    """Get crop suggestions and tips"""
    crop_name = request.query_params.get('crop', '').lower()

    # Predefined crop suggestions database
    crop_suggestions = {
        'wheat': {
            'name': 'Wheat',
            'best_season': 'Rabi (Winter)',
            'temperature': '15-25°C',
            'soil': 'Well-drained loamy soil',
            'water': 'Moderate watering, avoid waterlogging',
            'tips': [
                'Sow seeds in rows 20-22 cm apart',
                'Apply nitrogen fertilizer in 3 splits',
                'Irrigate at critical growth stages (crown root, tillering, flowering)',
                'Control weeds within first 30-40 days',
                'Harvest when moisture content is 20-25%'
            ],
            'diseases': ['Rust', 'Powdery mildew', 'Leaf blight'],
            'duration': '120-150 days'
        },
        'rice': {
            'name': 'Rice',
            'best_season': 'Kharif (Monsoon)',
            'temperature': '20-35°C',
            'soil': 'Clay or clay loam soil',
            'water': 'Heavy watering required, can withstand flooding',
            'tips': [
                'Transplant seedlings at 21-28 days old',
                'Maintain 5-10 cm water level in field',
                'Apply fertilizers based on soil test',
                'Remove weeds regularly',
                'Harvest when 80% grains turn golden yellow'
            ],
            'diseases': ['Blast', 'Sheath blight', 'Brown spot'],
            'duration': '90-120 days for short duration, 130-150 for long duration'
        },
        'corn': {
            'name': 'Corn (Maize)',
            'best_season': 'Kharif (Monsoon) or Rabi',
            'temperature': '18-27°C',
            'soil': 'Well-drained loamy soil with good organic matter',
            'water': 'Regular watering, critical during tasseling and grain filling',
            'tips': [
                'Plant seeds 60-75 cm between rows, 20-25 cm between plants',
                'Side dress with nitrogen at knee-high stage',
                'Ensure proper drainage to avoid root rot',
                'Control stem borers and fall armyworm',
                'Harvest when kernels are at dough stage'
            ],
            'diseases': ['Maydis leaf blight', 'Common rust', 'Stalk rot'],
            'duration': '80-120 days'
        },
        'cotton': {
            'name': 'Cotton',
            'best_season': 'Kharif (Summer)',
            'temperature': '21-30°C',
            'soil': 'Deep, well-drained black cotton soil',
            'water': 'Moderate watering, drought tolerant',
            'tips': [
                'Sow seeds with 60-90 cm row spacing',
                'Apply nitrogen in 2-3 splits',
                'Regular monitoring for bollworm',
                'Pruning and defoliation for better yield',
                'Harvest when bolls fully open'
            ],
            'diseases': ['Wilt', 'Leaf curl', 'Root rot'],
            'duration': '150-180 days'
        },
        'tomato': {
            'name': 'Tomato',
            'best_season': 'Year-round with protection',
            'temperature': '20-25°C',
            'soil': 'Well-drained sandy loam with pH 6.0-7.0',
            'water': 'Regular watering, drip irrigation recommended',
            'tips': [
                'Transplant seedlings at 4-6 weeks',
                'Stake plants for support',
                'Prune suckers for better fruit development',
                'Mulch to conserve moisture',
                'Harvest when fruits are fully colored'
            ],
            'diseases': ['Early blight', 'Late blight', 'Leaf curl virus'],
            'duration': '60-85 days after transplanting'
        }
    }

    if crop_name and crop_name in crop_suggestions:
        return Response({
            'crop': crop_suggestions[crop_name],
            'success': True
        })
    elif crop_name:
        return Response({
            'error': 'Crop not found',
            'message': f'No suggestions available for {crop_name}',
            'available_crops': list(crop_suggestions.keys())
        }, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({
            'crops': crop_suggestions,
            'success': True
        })


# AI Chatbot Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chatbot(request):
    """AI Chatbot for farming queries"""
    message = request.data.get('message', '')

    if not message:
        return Response({
            'error': 'Message is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    api_key = settings.OPENAI_API_KEY

    if not api_key:
        # Fallback to rule-based responses if OpenAI not configured
        return get_fallback_response(message)

    try:
        openai.api_key = api_key

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are FarmerGPT, a helpful AI assistant specialized in agriculture and farming. "
                               "Provide practical, accurate advice to farmers about crops, weather, pest management, "
                               "soil health, irrigation, and other farming topics. Keep responses concise and actionable."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_tokens=500,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content

        return Response({
            'response': ai_response,
            'success': True
        })

    except Exception as e:
        return get_fallback_response(message)


def get_fallback_response(message):
    """Fallback rule-based responses when OpenAI is not available"""
    message_lower = message.lower()

    responses = {
        'weather': 'Check the weather section on your dashboard for current conditions and forecasts. Plan your farming activities based on upcoming rain predictions.',
        'irrigation': 'Irrigation timing depends on your crop type and soil moisture. Generally, irrigate during early morning or evening. Use drip irrigation for water efficiency.',
        'fertilizer': 'Apply fertilizers based on soil test results. Use organic compost, NPK fertilizers in recommended doses, and split applications for better results.',
        'pest': 'For pest control, use integrated pest management (IPM). Monitor regularly, use biological controls when possible, and apply pesticides only when necessary.',
        'soil': 'Maintain soil health through crop rotation, adding organic matter, proper drainage, and regular soil testing. pH should be 6.0-7.5 for most crops.',
        'harvest': 'Harvest crops at the right maturity stage. Check for color, moisture content, and texture. Early morning is usually the best time for harvesting.',
        'seed': 'Use certified seeds from reliable sources. Treat seeds before sowing to prevent diseases. Store seeds in cool, dry places.',
    }

    for keyword, response in responses.items():
        if keyword in message_lower:
            return Response({
                'response': response,
                'success': True,
                'note': 'This is a basic response. Configure OpenAI API key for advanced AI responses.'
            })

    return Response({
        'response': 'I can help you with farming questions about crops, weather, irrigation, fertilizers, pest control, '
                   'soil management, and harvesting. Please ask a specific question!',
        'success': True,
        'note': 'Configure OpenAI API key in .env for advanced AI responses.'
    })
