import os, json, requests

KLAVIYO_ENDPOINT = "https://a.klaviyo.com/api/events"
KLAVIYO_PRIVATE_KEY = os.getenv("KLAVIYO_API_KEY")


def send_klaviyo_email(event_name: str, receiver_email: str, content={}):
    user_details = {
        "$email": receiver_email,
        "extras": "",
    }

    content.update(user_details)

    payload = {
        "data": {
            "type": "event",
            "attributes": {
                "properties": {},
                "metric": {
                    "data": {"type": "metric", "attributes": {"name": event_name}}
                },
                "profile": {
                    "data": {
                        "type": "profile",
                        "attributes": {"email": receiver_email, "properties": content},
                    }
                },
            },
        }
    }

    headers = {
        "accept": "application/json",
        "revision": "2024-02-15",
        "content-type": "application/json",
        "Authorization": f"Klaviyo-API-Key {KLAVIYO_PRIVATE_KEY}",
    }

    response = requests.request(
        "POST", KLAVIYO_ENDPOINT, data=json.dumps(payload), headers=headers
    )

    if not response.ok:
        print("Klaviyo API Error: " + str(response.text))

    if response.ok:
        return "Sent", response.text

    return "Retry", response.text
