from django.shortcuts import render, get_object_or_404, redirect
from .models import Job

def job_list(request):
    jobs = Job.objects.all()
    return render(request, 'jobs/job_list.html', {'jobs': jobs})

def job_detail(request, pk):
    job = get_object_or_404(Job, pk=pk)
    return render(request, 'jobs/job_detail.html', {'job': job})

def job_create(request):
    # for now just a placeholder
    return render(request, 'jobs/job_create.html')

def apply_job(request, pk):
    # placeholder for proposal logic
    return redirect('job_detail', pk=pk)
