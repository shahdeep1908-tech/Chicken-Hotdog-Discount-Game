import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User, DiscountRule, Activity
from .utils.klaviyo import send_klaviyo_email


def game_view(request):
    return render(request, 'index.html')


def get_discount(request):
    """API to return discount based on distance"""
    distance = request.GET.get("distance", 200)

    if distance is None:
        return JsonResponse({"error": "Distance parameter is required"}, status=400)

    try:
        distance = round(float(distance))
        distance = int(float(distance))
        print(distance)
        discount_rule = DiscountRule.objects.filter(
            min_distance__lte=distance, max_distance__gte=distance
        ).first()

        if discount_rule:
            return JsonResponse({"discount": discount_rule.discount_percentage})
        else:
            return JsonResponse({"discount": "No discount available"})

    except ValueError:
        return JsonResponse({"error": "Invalid distance value"}, status=400)


@csrf_exempt
def save_score(request):
    """API to save user score and trigger Klaviyo email"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            name = data.get("name", email.split("@")[0])
            distance = int(data.get("actualDistance", 0))
            discount_received = int(data.get("discount", 0))

            if not email or distance <= 0:
                return JsonResponse({"error": "Invalid data"}, status=400)

            # Get or create user
            user, created = User.objects.get_or_create(email=email,
                                                       defaults={
                                                           "username": name,
                                                           "name": name,
                                                       })

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

            return JsonResponse({"message": "Score saved", "top_score": user.top_score, "last_score": user.last_score})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
