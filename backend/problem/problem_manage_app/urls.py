from django.urls import path, include
from rest_framework import routers
from . import views
from .views import *
from .api import *

router = routers.DefaultRouter() #DefaultRouter를 설정
router.register('Problem', views.ProblemViewSet) #itemviewset 과 item이라는 router 등록

urlpatterns = [
    path('', include(router.urls)),
    path('problem/id/<int:user_id>', ProblemWithUserID.as_view(), name='ProblemWithUserID'),
    path('user/id/<int:user_id>/<int:id>', ProblemWithUserIDAndProblemID.as_view(), name='ProblemWithUserIDAndProblemID'),
]