from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FarmerProfile, Crop

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)


class FarmerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = FarmerProfile
        fields = ('id', 'user', 'phone', 'location', 'land_size', 'experience_years', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CropSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.user.username', read_only=True)

    class Meta:
        model = Crop
        fields = ('id', 'farmer', 'farmer_name', 'name', 'variety', 'area', 'planting_date',
                  'expected_harvest_date', 'status', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    phone = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone', 'location')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Remove password2 and profile fields from validated_data
        validated_data.pop('password2')
        phone = validated_data.pop('phone', '')
        location = validated_data.pop('location', '')

        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )

        # Create farmer profile
        FarmerProfile.objects.create(
            user=user,
            phone=phone,
            location=location
        )

        return user
