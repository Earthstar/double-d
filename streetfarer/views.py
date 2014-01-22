import json

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

def login_ajax(request):
    '''
    Login function intended to be used with ajax request.
    Not going to use UserForm.
    Returns json of form {
        status: <"error", "okay">,
        message: <Description of status>
    }
    '''
    message = _login_ajax(request)
    message = json.dumps(message)
    return HttpResponse(content=message, content_type="application/json")

def _login_ajax(request):
    '''
    Helper function for login_ajax.
    Returns a json object.
    '''
    if request.method == "POST":
        if not "username" in request.POST and "password" in request.POST:
            message = {
                "status": "error",
                "message": "Invalid form input"
                }
            return message
        username = request.POST["username"]
        password = request.POST["password"]
        # Verify that user exists
        if User.objects.filter(username=username).count() == 0:
            message = {
                "status": "error",
                "message": "Username doesn't exist"
            }
            return message
        user = authenticate(username=username, password=password)
        print user
        print type(user)
        if user is not None:
            # is_active is a boolean, not a function like Django documentation says
            if user.is_active:
                login(request, user)
                message = {
                    "status": "okay",
                    "message": "Login successful"
                }
                return message
            else:
                message = {
                    "status": "error",
                    "message": "User is not active"
                }
                return message
        else:
            message = {
                "status": "error",
                "message": "Wrong password for username"
            }
            return message
    else:
        message = {
            "status": "error",
            "message": "Wrong request method"
        }
        return message