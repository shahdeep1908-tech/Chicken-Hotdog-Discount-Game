from django.contrib import admin
from django.contrib.admin.filters import RelatedOnlyFieldListFilter

from .models import User, DiscountRule, Activity


class ActivityInline(admin.TabularInline):  # Can also use admin.StackedInline
    model = Activity
    extra = 0  # No empty fields
    readonly_fields = ('distance_achieved', 'discount', 'created_at')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'top_score', 'last_score', 'created_at', 'modified_at')
    search_fields = ('name', 'email')
    list_filter = ('created_at',)
    inlines = [ActivityInline]


@admin.register(DiscountRule)
class DiscountRuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'min_distance', 'max_distance', 'discount_percentage', 'discount_code', 'created_at', 'modified_at')
    search_fields = ('discount_code',)
    list_filter = ('discount_percentage',)


class UserDropdownFilter(admin.SimpleListFilter):
    title = "User"
    parameter_name = "user"

    def lookups(self, request, model_admin):
        """List all users in the dropdown."""
        return [(user.id, user.username) for user in User.objects.all()]

    def queryset(self, request, queryset):
        """Filter activities based on selected user."""
        if self.value():
            return queryset.filter(user__id=self.value())
        return queryset


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('distance_achieved', 'user', 'discount', 'created_at', 'modified_at')
    search_fields = ('user__username', 'user__email')
    list_filter = (
        "created_at",
        "discount",
        UserDropdownFilter,
    )

    autocomplete_fields = ["user"]
