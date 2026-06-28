from django.urls import path

from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('challenges', views.challenges, name='challenges'),
    path('challenges/<str:challenge_id>', views.challenge_detail, name='challenge-detail'),
    path('submissions', views.submit_result, name='submit-result'),
    path('my-submissions', views.my_submissions, name='my-submissions'),
    path('profile', views.profile, name='profile'),
    path('leaderboard', views.leaderboard, name='leaderboard'),
    path('bmi', views.bmi, name='bmi'),
]
