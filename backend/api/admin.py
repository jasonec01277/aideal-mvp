from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Deal, SavedDeal

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'score', 'created_at')
    search_fields = ('title',)

@admin.register(SavedDeal)
class SavedDealAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'deal', 'created_at')
    search_fields = ('user__username', 'deal__title')
