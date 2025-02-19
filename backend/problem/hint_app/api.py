from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hint
from problem_manage_app.models import Problem
from .serializers import *
from authenticate.authenticate import *

import openai
from decouple import config

#config api key
openai.api_key = config('OPENAI_API_KEY', default=None)

class HintWithProblemID(APIView):
    def get(self, request, problem_id):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        try:
            problem = Problem.objects.get(id=problem_id, user_id=user.id)
        except Problem.DoesNotExist:
            return Response({'error':'problem does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        model = Hint.objects.filter(problem_id=problem_id)
        serializer = HintSerializer(model, many=True)
        
        if len(serializer.data) == 0:
            return Response({'error':'no hint exists for this problem'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request, problem_id):
        problem_model = Problem.objects.get(problem_id = problem_id)
        
        if openai.api_key is None:
            return Response({'error':'No API KEY'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            #TODO 힌트 생성
            return Response({'success':True}, status=status.HTTP_201_CREATED)