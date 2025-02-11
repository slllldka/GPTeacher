from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Problem
from .serializers import *

class ProblemWithUserID(APIView):
    
    def get(self, request, user_id):
        model = Problem.objects.filter(user_id=user_id)
        serializer = ProblemSerializer(model, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, user_id):
        serializer = ProblemSerializer(data=request.data, context={'user_id':user_id})
        if serializer.is_valid():
            serializer.save()
            return Response({'success':True}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error':'wrong parameters'}, status = status.HTTP_400_BAD_REQUEST)
        
class ProblemWithUserIDAndProblemID(APIView):
    
    def get(self, request, user_id, id):
        try:
            model = Problem.objects.get(id=id, user_id=user_id)
        except Problem.DoesNotExist:
            return Response({'error':'content does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProblemSerializer(model)
        return Response(serializer.data, stauts=status.HTTP_200_OK)
    
    def patch(self, request, user_id, id):
        try:
            model = Problem.objects.get(id=id, user_id=user_id)
        except Problem.DoesNotExist:
            return Response({'error':'content does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProblemSerializer(model, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success:True'}, status=status.HTTP_200_OK)
        else:
            return Response({'error':'wrong parameters'}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id, id):
        try:
            model = Problem.objects.get(id=id, user_id=user_id)
        except Problem.DoesNotExist:
            return Response({'error':'content does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        model.delete()
        return Response({'success':True}, status=status.HTTP_200_OK)