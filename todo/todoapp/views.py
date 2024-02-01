from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import HttpResponse
import json
from .models import ToDoItems

@method_decorator(csrf_exempt, name='dispatch')
class ToDoList(View):
    def get(self, request):
        todos = ToDoItems.objects.all()
        data = [{ 'id': todo.id,'title': todo.title, 'description':todo.description, "completed": todo.completed} for todo in todos]

        return JsonResponse({'todos': data})
    
    def post(self, request):
        data = json.loads(request.body)

        title = data.get('title')
        description = data.get('description')
        completed = data.get('completed', False)

        todo = ToDoItems.objects.create(title = title, description = description, completed = completed)

        return JsonResponse({
            'id': todo.id,
            'title': todo.title,
            'description': todo.description,
            'completed':todo.completed
        })


@method_decorator(csrf_exempt, name='dispatch')
class ToDoDetails(View):
    def get(self, request, todo_id):
        todo = get_object_or_404(ToDoItems, pk=todo_id)

        data = { 'id': todo.id,'title': todo.title, 'description':todo.description, "completed": todo.completed}

        return JsonResponse(data)
    
    def put(self, request, todo_id):
        todo = get_object_or_404(ToDoItems, pk= todo_id)

        data = json.loads(request.body)

        todo.title = data.get('title', todo.title )
        todo.description = data.get('description', todo.description )
        todo.completed = data.get('completed', todo.completed )

        todo.save()

        return JsonResponse({ 'id': todo.id,'title': todo.title, 'description':todo.description, "completed": todo.completed})
    
    def delete(self, request, todo_id):
        todo = get_object_or_404(ToDoItems, pk = todo_id)
        todo.delete()

        return HttpResponse(status = 204)