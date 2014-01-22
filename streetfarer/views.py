from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
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

# This decorator automatically directs user to the login page
# You can direct the user to the page they were trying to visit by using the 'next' parameter
@login_required
def secret(request):
    user = request.user
    t = get_template('secret.html')
    html = t.render(Context({'user': user}))
    return HttpResponse(html)

def logout_page(request):
    """
    Log users out and re-direct them to the main page.
    """
    logout(request)
    return HttpResponseRedirect('/')

def harmony(request):
    t = get_template('harmony.html')
    html = t.render(Context({'title': "Django Title"}))
    return HttpResponse(html)

def mockup(request):
    t = get_template('mockup.html')
    html = t.render(Context({}))
    return HttpResponse(html)

def login_user(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            # login user
            pass
            return HttpResponse("success")
        else:
            return HttpResponse("failure")
