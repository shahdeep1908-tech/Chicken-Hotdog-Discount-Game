from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, Group, Permission


class UserManager(BaseUserManager):
    def create_user(
            self, email, name, username, password=None,
            commit=True):
        """
        Creates and saves a User with the given email, first name, last name
        and password.
        """
        if not email:
            raise ValueError('Users must have an email')

        user = self.model(
            email=email,
            name=name,
            username=username
        )

        user.set_password(password)
        if commit:
            user.save(using=self._db)
        return user

    def create_superuser(self, email, name, username, password):
        """
        Creates and saves a superuser with the given email, first name,
        last name and password.
        """
        user = self.create_user(
            email=email,
            username=username,
            name=name,
            password=password,
            commit=False,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    # Basic information
    name = models.CharField(max_length=255, null=True)
    email = models.EmailField(unique=True)
    username = models.CharField(verbose_name="Username", max_length=150, unique=True, blank=True, null=True)
    top_score = models.IntegerField(default=0)
    last_score = models.IntegerField(default=0)

    # Auto fields
    created_at = models.DateTimeField(auto_now_add=True, editable=False, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, editable=False, db_index=True)

    REQUIRED_FIELDS = ['name', 'email']
    objects = UserManager()

    def __str__(self):
        return self.username


class DiscountRule(models.Model):
    min_distance = models.IntegerField()
    max_distance = models.IntegerField()
    discount_percentage = models.IntegerField()
    discount_code = models.CharField(max_length=20, unique=True)

    # Auto fields
    created_at = models.DateTimeField(auto_now_add=True, editable=False, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, editable=False, db_index=True)

    def __str__(self):
        return f"{self.discount_percentage}% Discount ({self.min_distance}-{self.max_distance}m)"


class Activity(models.Model):
    distance_achieved = models.IntegerField()

    # Relation Field
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    discount = models.ForeignKey(DiscountRule, related_name='discount', on_delete=models.CASCADE)

    # Auto fields
    created_at = models.DateTimeField(auto_now_add=True, editable=False, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, editable=False, db_index=True)

    def __str__(self):
        return f"{self.user.username} - {self.distance_achieved}m"
