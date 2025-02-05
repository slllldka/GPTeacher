from django.urls import path, include
from .views import *

urlpatterns = [
    path('email_request', emailVerificationRequest, name='email_request'),
    path('email_response', emailVerificationResponse, name='email_response'),
    path('signup', signup, name='signup'),
    path('signin', signin, name='signin'),
    path('valid', valid, name='valid'),
    path('refresh', refresh, name='refresh'),
]