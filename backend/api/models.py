from django.db import models

class Deal(models.Model):
    title = models.CharField(max_length=200)
    price = models.IntegerField()
    # auto-computed score (0..100)
    score = models.IntegerField(default=0)

    # NEW optional fields to improve scoring
    year = models.IntegerField(null=True, blank=True)
    mileage = models.IntegerField(null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    photo_url = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def compute_score(self) -> int:
        """
        Very simple scoring:
        - Lower price -> higher score
        - Newer year helps
        - Lower mileage helps
        Capped to [0, 100]
        """
        price_component = 60 - (self.price or 0) / 1000.0        # $1k reduces 1 point
        year_component = 0
        if self.year:
            year_component = (self.year - 2015) * 2              # newer than 2015 adds points

        mileage_component = 0
        if self.mileage:
            mileage_component = 20 - (self.mileage / 10000.0)    # every 10k miles reduces 1 point

        raw = price_component + year_component + mileage_component
        return max(0, min(100, round(raw)))

    def save(self, *args, **kwargs):
        # Always recompute on save
        self.score = self.compute_score()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} (${self.price})"

from django.conf import settings
from django.db import models

# ... your existing Deal model stays as-is ...

class SavedDeal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_deals")
    deal = models.ForeignKey('api.Deal', on_delete=models.CASCADE, related_name="saved_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'deal')  # a user can save a given deal only once
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} → {self.deal_id}"
