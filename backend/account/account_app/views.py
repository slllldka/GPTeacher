from django.forms import model_to_dict
from django.shortcuts import render

from .models import User

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

import random
from django.core.cache import cache
from django.core.mail import EmailMessage

from django.contrib.auth import authenticate

# Create your views here.

@api_view(['POST'])
def emailVerificationRequest(request):
    user_email = request.data.get('email')
    
    try:
        email = User.objects.get(email=user_email)
        return Response({'error':'email already exist'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist as e:
        verification_code = str(random.randint(100000, 999999))
        cache.set(user_email, verification_code, timeout=15*60)
        title = 'GPTeacher: Verify Your Email'
        message = f"""
        <html>
        <body>
            <p>Hello, Thank you for signing up!</p>
            <p>To complete your registration and verify your email address, please use the following 6-digit verification code:</p>
            
            <div style="font-size: 28px; font-weight: bold; color: #333; background-color: #f1f1f1; padding: 10px 20px; border-radius: 5px; margin-top: 20px; letter-spacing: 2px;">
            {verification_code}
            </div>
            
            <p>If you did not request this, please ignore this email. The code will expire in 15 minutes.</p>
        </body>
        </html>
        """
        recipient_list = [user_email]
        email = EmailMessage(title, message, 'sne0103@gmail.com', recipient_list)
        email.content_subtype = 'html'
        
        if email.send():
            return Response({'success':True})
        else:
            return Response({'error':'Failed to send email'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['POST'])
def emailVerificationResponse(request):
    user_email = request.data.get('email')
    user_code = request.data.get('code')
    stored_code = cache.get(user_email)
    
    if stored_code is None:
        return Response({'error':'No verification email has sent or it has expired'}, status=status.HTTP_400_BAD_REQUEST)
    if user_code == stored_code:
        cache.delete(user_email)
        return Response({'success':True})
    else:
        return Response({'error':'Invalid Verification Code'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')
    interest = request.data.get('interest')
    
    try:
        User.objects.create_user(email=email, password=password, name=name, interest=interest)
        return Response({'success':True}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def signin(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=email, password=password)
    
    #success
    if user is not None:
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        return Response({'success':True, 'access':str(access_token), 'refresh':str(refresh_token)}, status=status.HTTP_200_OK)
    #fail
    else:
        return Response({'error':'wrong email or password'}, status=status.HTTP_401_UNAUTHORIZED)

# whether JWT is valid
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def valid(request):
    return Response({'success':True, 'user':model_to_dict(request.user, fields=['id', 'interest', 'llm_num', 'is_superuser'])}, status=status.HTTP_200_OK)
    
# refresh access token with refresh token
@api_view(['POST'])
def refresh(request):
    refreshStr = request.data.get('refresh')
    if refreshStr is None:
        return Response({'error':'need refresh token'}, status = status.HTTP_400_BAD_REQUEST)
    else:
        try:
            refresh_token = RefreshToken(refreshStr)
            access_token = refresh_token.access_token
            return Response({'access':str(access_token)})
        
        except TokenError:
            return Response({'error':'expired refresh token'}, status = status.HTTP_401_UNAUTHORIZED)