from rest_framework import serializers
from .models import Deal

class DealSerializer(serializers.ModelSerializer):
    # score is computed by the model; make it read-only from the API
    score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Deal
        fields = [
            "id", "title", "price", "score",
            "year", "mileage", "url", "photo_url",
            "created_at",
        ]
        read_only_fields = ["id", "score", "created_at"]

from rest_framework import serializers
from .models import Deal, SavedDeal

class SavedDealSerializer(serializers.ModelSerializer):
    deal = DealSerializer(read_only=True)

    class Meta:
        model = SavedDeal
        fields = ['id', 'deal', 'created_at']
