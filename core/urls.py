from django.urls import path
from .views import todos, add_todo, delete_todo, update_todo

urlpatterns = [
    path('', todos, name='todos'),  # List all todos (GET request)
    path('add-todo/', add_todo, name='add_todo'),  
    path('todos/<int:pk>/', update_todo, name='update-todo'),  # PUT request to update todo
    path('delete/<int:pk>/', delete_todo, name='delete-todo'),  # DELETE request to delete todo
 

]
