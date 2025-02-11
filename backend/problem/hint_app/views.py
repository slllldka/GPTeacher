from django.shortcuts import render

from .models import Hint

from rest_framework import viewsets
from .serializers import HintSerializer

# Create your views here.

class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Hint.objects.all()
    serializer_class = HintSerializer