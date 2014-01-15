from django.contrib.auth import authenticate, login
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
    '''
    Example of user creation form. Form automatically checks if user already exists.
    '''
    # username = request.POST['username']
    # password = request.POST['password']
    # user = authenticate(username=username, password=password)
    # if user is not None:
    #     if user.is_active:
    #         login(request, user)
    #         return HttpResponseRedirect('success/')
    #     else:
    #         return HttpResponse('Disabled account')
    # else:
    #     return HttpResponse('invalid login')

    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            User.objects.create_user(**form.cleaned_data)
            # Must call authenticate before calling login
            user = authenticate(username=request.POST['username'], password=request.POST['password'])
            # Since user was just created, don't bother doing existence checks
            login(request, user)

            # if user is not None:
            #     if user.is_active:
            #         login(request, user)
            #         return HttpResponseRedirect('/success/')
            #     else:
            #         return HttpResponse('Disabled Account')
            # else:
            #     return HttpResponse('Invalid login')
    else:
        form = UserForm()

    return render(request, 'adduser.html', {'form': form})