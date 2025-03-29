from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='game-view'),
    path("get-discount/", views.get_discount, name="get-discount"),
    path("api/get-discount/", views.api_get_discount, name="api-get-discount"),
    path("claim-code/", views.claim_code, name="claim-code"),
    path("api/claim-code/", views.api_claim_code, name="api-claim-code"),
]
