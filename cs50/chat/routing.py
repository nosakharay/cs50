from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/chat-list/', consumers.ChatListConsumer.as_asgi()),
    re_path(r'ws/chat/comm/(?P<comm_id>\w+)/$', consumers.CommunityChatConsumer.as_asgi())
]