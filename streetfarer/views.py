from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render

from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from django.template import RequestContext

from pathgenerator.models import UserForm

def home(request):
    return HttpResponse('Home page')

def add_user(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            new_user = User.objects.create_user(**form.cleaned_data)
            # bug here: user created, but login failing
            login(new_user)
            # redirect, or however you want to get to the main view
            return HttpResponseRedirect('main.html')
    else:
        form = UserForm()

    # return render_to_response('adduser.html', {'form': form}, context_instance=RequestContext(request))
    return render(request, 'adduser.html', {'form': form})