
import base64
import json

token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhY2NvdW50SWQiOiIxNzQwZDdlYi1kNjg2LTRjYWUtYjAyYi00MWI4ZGM3MGQ1Y2MiLCJ0eXBlIjoibWVyY2hhbnQiLCJzYWx0IjoiYzJlZjRmOTMtNWEzZC00ZGZmLTk4YzMtYTIxZTEwODA3ZmM1Iiwicm9sZXMiOlsiUk9MRV9NRVJDSEFOVCJdLCJpc010bHMiOmZhbHNlLCJpYXQiOjE3NzEyNDk0NDEsImlzcyI6IlRhbWFyYSBQUCJ9.uzBgCumu3VRR_j9rAJmHK05i_T1cmM0zZZIfuXf9pPbsf2FN9jw9hujZZVaDUhjAIvn4zVyp6pZiaUBZo7YFBJbmu3HEvbcPQf7u_obHsXD-m0zwepsMHjP2F9mO61pE9nI77d3V_lXpaaaGZ_wyRhEwiGwpZ6dEcp1anA9lqhVsFdBSQfW7wjZ7KF7UYaojXLaUEiExypqln70rRIZhOwUySqpboKoF1UcLg2dB5kTmB5yMY16lcXb7oOhSMQ2fSoLx5EqXfm1V7XUCYH19y8jsjdxZFxWtuOrldAMdlXrFNxWK1HS_QEt1seohVSsvEb_G6_uBI64h4YOevUJjOg"

parts = token.split('.')
if len(parts) != 3:
    print("Invalid token format")
else:
    header = json.loads(base64.urlsafe_b64decode(parts[0] + "==").decode('utf-8'))
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + "==").decode('utf-8'))
    print(f"Header: {header}")
    print(f"Payload: {payload}")
