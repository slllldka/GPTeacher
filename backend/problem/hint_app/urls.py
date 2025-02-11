from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
from .api import *

router = routers.DefaultRouter() #DefaultRouter를 설정
router.register('Hint', views.HintViewSet) #itemviewset 과 item이라는 router 등록

urlpatterns = [
    path('', include(router.urls)),
    path('hint/id/<int:problem_id>', HintWithProblemID.as_view(), name='HintWithProblemID'),
]