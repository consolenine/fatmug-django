from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    '''serializer for the user object'''
    
    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        
        return user
