from django.contrib import admin
from django.urls import path, include

from knox import views as knox_views

from .views import CreateUserView, LoginView, UserView

urlpatterns = [
    path("create/", CreateUserView.as_view(), name="create"),
    path("user/", UserView.as_view(), name="user"),
    path("login/", LoginView.as_view(), name="knox_login"),
    path("logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
]