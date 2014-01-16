import json

from django.core.context_processors import csrf
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import Template, Context
from django.template.loader import get_template

from pathgenerator.models import Place


# Create your views here.
def map_page(request):
    t = get_template('map.html')
    html = t.render(Context({}))
    return HttpResponse(html)
def mapsearch_page(request):
    # Need to add csrf token to every page with a form or ajax
    c = {}
    c.update(csrf(request))
    return render_to_response('map_search.html', c)

def get_place_list(request):
    print 'in get_place_list'
    # c = {}
    # c.update(csrf(request))
    if request.method == 'POST':
        json_string = request.POST.getlist('results[]')
        print json_string
        print request.body
        #process_place_json(json_string)
    return HttpResponse('success')

def process_place_json(json_string):
    '''
    Processes json into places.
    '''
    print json_string
    json_places = json.loads(json_string)
    place_array = json['results']
    for place in place_array:
        print place
        pass
        # Place.objects.create()

def ajaxtest(request):
    # c = {}
    # c.update(csrf(request))
    return HttpResponse('success')