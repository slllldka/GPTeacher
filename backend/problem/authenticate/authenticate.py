from rest_framework.response import Response
from rest_framework import status
import requests

class ResponseException(Exception):
    def __init__(self, response):
        self.response = response

def getHeader(request):
    header = request.headers.get('Authorization')
    if header is None:
        raise ResponseException(Response({'error':'no header'}, status=status.HTTP_401_UNAUTHORIZED))
    header_parts = header.split()
    if len(header_parts) > 1:
        return header.split()[1]
    else:
        raise ResponseException(Response({'error':'need access token in header'}, status=status.HTTP_401_UNAUTHORIZED))

def authenticate(access_token):
    url = 'http://127.0.0.1:8000/account/valid'
    headers = {'Authorization': 'Bearer ' + access_token}
    response = requests.post(url, headers=headers)
    if response.status_code != 200:
        raise ResponseException(Response({'error':'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED))
    return response.json().get('user')