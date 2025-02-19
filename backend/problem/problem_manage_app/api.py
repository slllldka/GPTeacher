from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Problem
from .serializers import *
from authenticate.authenticate import *

class ListofProblem(APIView):
    
    def get(self, request, page: int):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        count = Problem.objects.count(user_id=user['id'])
        if page <= 0:
            page = 1
        elif count == 0:
            page = 1
        elif (10*(page-1)+1) > count:
            page = int((count-1) / 10) + 1
        
        model = Problem.objects.filter(user_id=user['id'])[10*(page-1), 10*page]
        serializer = ProblemSerializer(model, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class OneProblem(APIView):
    
    def get(self, request, id):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        if id:
        
            try:
                model = Problem.objects.get(id=id, user_id=user['id'])
            except Problem.DoesNotExist:
                return Response({'error':'content does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ProblemSerializer(model)
            return Response(serializer.data, stauts=status.HTTP_200_OK)
        
        else:
            return Response({'error':'need problem id for this request'}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        data = request.data.copy()
        data['user_id'] = user['id']
        serializer = ProblemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success':True}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response({'error':'wrong parameters'}, status = status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, id):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        if id:
        
            try:
                model = Problem.objects.get(id=id, user_id=user['id'])
            except Problem.DoesNotExist:
                return Response({'error':'content does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ProblemSerializer(model, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'success:True'}, status=status.HTTP_200_OK)
            else:
                return Response({'error':'wrong parameters'}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({'error':'need problem id for this request'}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        if id:
        
            try:
                model = Problem.objects.get(id=id, user_id=user['id'])
            except Problem.DoesNotExist:
                return Response({'error':'content does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            model.delete()
            return Response({'success':True}, status=status.HTTP_200_OK)
        
        else:
            return Response({'error':'need problem id for this request'}, status=status.HTTP_400_BAD_REQUEST)