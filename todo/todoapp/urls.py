from django.urls import path
from .views import ToDoDetails, ToDoList


urlpatterns = [
    path('todos', ToDoList.as_view(), name='todo-list'),
    path('todos/<int:todo_id>', ToDoDetails.as_view(), name='todo-Details')
]