from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hint
from problem_manage_app.models import Problem
from .serializers import *
from authenticate.authenticate import *

import openai
from decouple import config
import json

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
            problem = Problem.objects.get(id=problem_id, user_id=user['id'])
        except Problem.DoesNotExist:
            return Response({'error':'problem does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        model = Hint.objects.filter(problem_id=problem_id).order_by('key_text_start_idx')
        serializer = HintSerializer(model, many=True)
        
        if len(serializer.data) == 0:
            return Response({'error':'no hint exists for this problem'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'hints':serializer.data}, status=status.HTTP_200_OK)
        
    def post(self, request, problem_id):
        try:
            access_token = getHeader(request)
        except ResponseException as e:
            return e.response
        
        try:
            user = authenticate(access_token)
        except ResponseException as e:
            return e.response
        
        try:
            problem = Problem.objects.get(id=problem_id, user_id=user['id'])
        except Problem.DoesNotExist:
            return Response({'error':'problem does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        hint_count = Hint.objects.filter(problem_id=problem_id).count()
        
        if hint_count > 0:
            return Response({'error':'hint already exists'}, status=status.HTTP_409_CONFLICT)
        else:
            if openai.api_key is None:
                return Response({'error':'No API KEY'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                '''
                response = openai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "당신은 날씨를 알려주는 모델입니다."},
                        {"role": "user", "content": "서울의 오늘 날씨를 알려주세요. 10글자 이내로 대답해주세요."}
                    ]
                )
                print(response.choices[0].message)
                결과: ChatCompletionMessage(content='맑고 쌀쌀함.', refusal=None, role='assistant', audio=None, function_call=None, tool_calls=None)
                '''
                response = openai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "너는 알고리즘 문제를 분석하고 힌트를 제공하는 모델이야. "
                         +"너는 내가 입력하는 텍스트에서 핵심 단어, 핵심 문장을 순서대로 뽑아내야 해. "
                         +"그리고 그것들이 중요한 이유와 얻을 수 있는 정보를 알려줘. "
                         +"이 텍스트를 보면 어떤 자료구조 또는 알고리즘을 사용하라는 것을 암시하는 것이라는 내용이면 좋아. "
                         +"그리고 최종적으로 이 문제에서 요구하는 자료구조와 알고리즘을 포함한 설명을 해주면 돼. "
                         +"답변은 JSON 형식으로 해야 돼. "
                         +"{\"hints\": [\"key_text\"(핵심 단어, 핵심 문장. 문제의 텍스트와 완벽하게 일치해야 함.), \"key_text_start_idx\"(문제 텍스트에서 key_text의 인덱스), \"description\"(핵심 단어, 핵심 문장에 대한 설명)으로 이루어진 object 의 배열], \"final_description\"(최종 설명)}."},
                        {"role": "user", "content": "제목: "+problem.title+"\n"
                         +"문제 설명: "+problem.problem_description+"\n"
                         +"입력 조건: "+problem.input_description+"\n"
                         +"출력 조건: "+problem.output_description+"\n"}
                    ],
                    response_format={"type":"json_object"}
                )
                
                response_json = json.loads(response.choices[0].message.content)
                hints = response_json.get('hints')
                print(hints)
                
                for hint in hints:
                    Hint.objects.create(problem_id=problem,
                                        key_text=hint['key_text'],
                                        key_text_start_idx=hint['key_text_start_idx'],
                                        key_text_end_idx=0,
                                        description=hint['description']
                                        )
                
                final_description = response_json.get('final_description')
                print(final_description)
                
                Hint.objects.create(problem_id=problem,
                                    key_text='final_description',
                                    key_text_start_idx=-1,
                                    key_text_end_idx=0,
                                    description=final_description
                                    )
                
                return Response({'success':True}, status=status.HTTP_201_CREATED)