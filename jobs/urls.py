from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list, name='job_list'),            # homepage = show all jobs
    path('job/<int:pk>/', views.job_detail, name='job_detail'),  # single job details
    path('job/create/', views.job_create, name='job_create'),    # post a new job
    path('job/<int:pk>/apply/', views.apply_job, name='apply_job'),  # apply/propose to a job
]
