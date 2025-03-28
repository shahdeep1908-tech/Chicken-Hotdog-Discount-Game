from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from .models import DiscountRule, User, Activity
import json


# def game_view(request):
#     return render(request, 'index.html')
#
#
# def get_discount(request):
#     """API to return discount based on distance"""
#     distance = request.GET.get("distance", 200)
#
#     if distance is None:
#         return JsonResponse({"error": "Distance parameter is required"}, status=400)
#
#     try:
#         distance = round(float(distance))
#         distance = int(float(distance))
#         print(distance)
#         discount_rule = DiscountRule.objects.filter(
#             min_distance__lte=distance, max_distance__gte=distance
#         ).first()
#
#         if discount_rule:
#             return JsonResponse({"discount": discount_rule.discount_percentage})
#         else:
#             return JsonResponse({"discount": "No discount available"})
#
#     except ValueError:
#         return JsonResponse({"error": "Invalid distance value"}, status=400)
#
#
# @csrf_exempt
# def save_score(request):
#     """API to save user score and trigger Klaviyo email"""
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             email = data.get("email")
#             name = data.get("name", email.split("@")[0])
#             distance = int(data.get("actualDistance", 0))
#             discount_received = int(data.get("discount", 0))
#
#             if not email or distance <= 0:
#                 return JsonResponse({"error": "Invalid data"}, status=400)
#
#             # Get or create user
#             user, created = User.objects.get_or_create(email=email,
#                                                        defaults={
#                                                            "username": name,
#                                                            "name": name,
#                                                        })
#
#             # Update scores
#             final_score = distance
#             if final_score > user.top_score:
#                 user.top_score = final_score
#             user.last_score = final_score
#             user.save()
#
#             # Save activity
#             discount_obj = DiscountRule.objects.filter(discount_percentage=discount_received).first()
#             Activity.objects.create(user=user, distance_achieved=distance, discount=discount_obj)
#
#             # ✅ TODO: Send discount email via Klaviyo (Handled in a separate function)
#             # send_klaviyo_email(
#             #     event_name="",
#             #     receiver_email=user.email,
#             #     content={
#             #         "name": user.name,
#             #         "top_score": user.top_score,
#             #         "current_score": user.last_score,
#             #         "distance": distance,
#             #         "discount_received": discount_received,
#             #     }
#             # )
#
#             return JsonResponse({"message": "Score saved", "top_score": user.top_score, "last_score": user.last_score})
#
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#
#     return JsonResponse({"error": "Invalid request method"}, status=405)

@api_view(["GET"])
def get_discount(request):
    """API to return discount based on distance"""
    distance = request.query_params.get("distance", 200)

    if distance is None:
        return Response({"error": "Distance parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        distance = int(float(distance))  # Ensure valid integer distance
        discount_rule = DiscountRule.objects.filter(
            min_distance__lte=distance, max_distance__gte=distance
        ).first()

        if discount_rule:
            return Response({"discount": discount_rule.discount_percentage})
        else:
            return Response({"discount": "No discount available"})

    except ValueError:
        return Response({"error": "Invalid distance value"}, status=status.HTTP_400_BAD_REQUEST)


class ScoreSerializer(serializers.Serializer):
    email = serializers.EmailField(default="user@example.com")
    name = serializers.CharField(default="John Doe")
    actualDistance = serializers.IntegerField(default=300)
    discount = serializers.IntegerField(default=20)


@api_view(["POST"])
def claim_code(request):
    """API to save user score and trigger Klaviyo email"""
    try:
        # data = request.data  # DRF automatically parses request body
        # email = data.get("email")
        # name = data.get("name", email.split("@")[0]) if email else None
        # distance = int(data.get("actualDistance", 0))
        # discount_received = int(data.get("discount", 0))
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            email = data["email"]
            name = data["name"]
            distance = data["actualDistance"]
            discount_received = data["discount"]

        # Get or create user
        user, created = User.objects.get_or_create(email=email, defaults={"username": name, "name": name})

        # Update scores
        final_score = distance
        if final_score > user.top_score:
            user.top_score = final_score
        user.last_score = final_score
        user.save()

        # Save activity
        discount_obj = DiscountRule.objects.filter(discount_percentage=discount_received).first()
        Activity.objects.create(user=user, distance_achieved=distance, discount=discount_obj)

        # ✅ TODO: Send discount email via Klaviyo (Handled in a separate function)
        # send_klaviyo_email(
        #     event_name="",
        #     receiver_email=user.email,
        #     content={
        #         "name": user.name,
        #         "top_score": user.top_score,
        #         "current_score": user.last_score,
        #         "distance": distance,
        #         "discount_received": discount_received,
        #     }
        # )

        return Response({"message": "Score saved", "top_score": user.top_score, "last_score": user.last_score})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
