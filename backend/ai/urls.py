from django.urls import path
from .views import predict, chat

urlpatterns = [
    path("predict/", predict, name="predict"),
    path("gemini/chat/", chat, name="chat"),
]