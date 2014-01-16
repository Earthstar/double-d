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
    if request.method == 'POST':
        # this is a list of strings with one element
        place_string = request.POST.get('results[]')
        print type(place_string)
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
    print json.dumps(place_json[0], indent=2, separators=(',', ': '))
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
    # json_list = []
    # for string in string_list:
    #     j = json.loads(string)
    #     json_list.append(j)
        # print json.dumps(j, indent=2, separators=(',', ': '))
    # print json.dumps(json_list[0], indent=2, separators=(',', ': '))
    # print '###'
    # print json.dumps(json_list[0][0], indent=2, separators=(',', ': '))
    # print json_string
    # json_places = json.loads(json_string)
    # place_array = json['results']
    # for place in place_array:
    #     print place
    #     pass
        # Place.objects.create()

def ajaxtest(request):
    return HttpResponse('success')