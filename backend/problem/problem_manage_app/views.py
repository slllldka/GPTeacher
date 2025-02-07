from django.shortcuts import render

from .models import Problem

from rest_framework import viewsets
from .serializers import ProblemSerializer

# Create your views here.

class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer