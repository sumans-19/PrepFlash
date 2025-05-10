import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import google.generativeai as genai
import asyncio

# Load the environment variable
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import asyncio
import threading
import google.generativeai as genai
import requests
from django.http import JsonResponse

@csrf_exempt
def generate_resume(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        body_data = json.loads(request.body)
        # print(request.body)
        resume_data = body_data.get('resumeData')
        # print(resume_data)
        template = body_data.get('currentPrompt')
        # print(template)
        if not resume_data or not template:
            return JsonResponse({'error': 'Missing resumeData or template'}, status=400)

        prompt_template = template
        print(resume_data)
        if not prompt_template:
            return JsonResponse({'error': 'Template is missing promptTemplate'}, status=400)

        # Fill the prompt template with the resume data
        prompt = prompt_template.replace("{{resume_data}}", json.dumps(resume_data, indent=2))
        print(prompt)

        # Async Gemini call
        async def generate():
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = await model.generate_content_async(prompt)
            return response.text

        # Run async in thread
        def run_async_in_thread():
            try:
                return asyncio.run(generate())
            except Exception as e:
                print("Async generation error:", str(e))
                return None

        result_container = {}

        def thread_target():
            result_container['text'] = run_async_in_thread()

        thread = threading.Thread(target=thread_target)
        thread.start()
        thread.join()

        if 'text' in result_container and result_container['text']:
            return JsonResponse({'generatedResume': result_container['text']})
        else:
            return JsonResponse({'error': 'Failed to generate resume'}, status=500)

    except Exception as e:
        print("Resume generation error:", str(e))
        return JsonResponse({'error': str(e)}, status=500)



