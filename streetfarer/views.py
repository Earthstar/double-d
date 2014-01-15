from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, render_to_response
from django.template import Template, Context, RequestContext
from django.template.loader import get_template

from pathgenerator.models import UserForm

def home(request):
    t = get_template('index.html')
    html = t.render(Context({}))
    return HttpResponse(html)

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
    else:
        form = UserForm()

    return render(request, 'adduser.html', {'form': form})

# todo use decorator
def secret(request):
    if request.user.is_authenticated():
        user = request.user
        t = get_template('secret.html')
        html = t.render(Context({'user': user}))
    else:
        t = get_template('index.html')
        html = t.render(Context({}))
    return HttpResponse(html)