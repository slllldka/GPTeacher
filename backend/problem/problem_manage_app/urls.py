from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
from .api import *

router = routers.DefaultRouter() #DefaultRouter를 설정
router.register('Problem', views.ProblemViewSet) #itemviewset 과 item이라는 router 등록

urlpatterns = [
    path('', include(router.urls)),
    path('list/<int:page>', ListofProblem.as_view(), name='ListofProblem'),
    path('create', OneProblem.as_view(), name='OneProblem'),
    path('<int:id>', OneProblem.as_view(), name='OneProblem'),
]