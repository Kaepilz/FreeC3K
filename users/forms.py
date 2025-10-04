from django import forms 
from django.contrib.auth.forms import AuthenticationForm,UserCreationForm
from .models import User

class LoginForm(AuthenticationForm):
    username=forms.CharField(max_length=100)
    password=forms.CharField(widget=forms.PasswordInput())
    
    
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User  # your custom User model
        fields = ('username', 'email', 'is_client', 'is_freelancer')