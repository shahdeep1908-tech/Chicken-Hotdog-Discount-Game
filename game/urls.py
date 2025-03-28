from django.urls import path
from . import views

urlpatterns = [
    # path('', views.game_view, name='game-view'),
    path("api/get-discount/", views.get_discount, name="get-discount"),
    path("api/claim-code/", views.claim_code, name="claim-code"),
]
