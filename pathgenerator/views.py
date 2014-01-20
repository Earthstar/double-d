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
    html = t.render(Context())
    return HttpResponse(html)

def mapsearch_page(request):
    # Need to add csrf token to every page with a form or ajax
    c = {"tag_list":["restaurant", "cafe", "book_store", "zoo"]}
    c.update(csrf(request))
    return render_to_response('map_search.html', c)

def place(request):
    if request.method == 'POST':
        # this is a list of strings with one element
        place_string = request.POST.get('results[]')
        # print json_string
        process_place_json(place_string)
    return HttpResponse('success')

def process_place_json(place_string):
    '''
    Processes json into places.
    string_list - a list of strings which are json objects
    '''
    # this is now a list of dicts
    place_json = json.loads(place_string)
    for place in place_json:
        # Create a new Place only if not currently exists
        # This is a workaround because django doesn't like the string 'id'
        _place_id = str(place['id'])
        if Place.objects.filter(google_id=_place_id).count() < 1:
            print 'Object already in database'
            # Not sure if there will be decimal problems
            lat = place['geometry']['location']['d']
            lon = place['geometry']['location']['e']
            Place.objects.create(
                latitude=lat,
                longitude=lon,
                address='',
                name=place['name'],
                source='google',
                google_reference=place['reference'],
                google_id=_place_id,
                raw_data=json.dumps(place, separators=(',',':')),
                )

# Json format contains
# start, end - which are google latlon
# waypointIDs - strings that should correspond to an existing Place
def path(request):
    if request.method == "GET":
        return HttpResponse('Not implemented yet')
    if request.method== "POST":
        return HttpResponse('success')