import json

from django.core.context_processors import csrf
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import Template, Context
from django.template.loader import get_template

from pathgenerator.models import Place, Path, UserForm

# Create your views here.
def map_page(request):
    t = get_template('map.html')
    html = t.render(Context())
    return HttpResponse(html)

def mapsearch_page(request):
    # Need to add csrf token to every page with a form or ajax
    c = {"tag_list":["restaurant", "cafe", "book_store", "zoo"],
        "login_form": UserForm()}
    c.update(csrf(request))
    return render_to_response('map_search.html', c)

def place(request):
    if request.method == 'POST':
        # this is a list of strings with one element
        place_string = request.POST.get('results')
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
            lng = place['geometry']['location']['e']
            Place.objects.create(
                latitude=lat,
                longitude=lng,
                address='',
                name=place['name'],
                source='google',
                google_reference=place['reference'],
                google_id=_place_id,
                raw_data=json.dumps(place, separators=(',',':')),
                )

# Json format contains
# start, end - which are google latlng
# waypointIDs - strings that should correspond to an existing Place
#

# start, end, name
# start: {lat:
# lng:
# }

# waypoints: {
#     id: asdf,
#     lat:
#     lng:
# }
# use decorator?
def path(request):
    # User must be logged in to get and post paths
    # if not request.user.is_authenticated():
    #     return HttpResponse("User not logged in")
    if request.method == "GET":
        # get user's path
        path_name = request.GET['path_name']
        # problem:raises error if the path doesn't exist?
        try:
            path = Path.objects.get(user=request.user, name=path_name)
        except:
            # Status code for "no content"
            return HttpResponse(content="Path with specified user and name doesn't exist")
        # return a Json object that can be reconstituted into a path
        # Have to load waypoints otherwise it doesn't get deserialized correctly
        path_dict = {
            "name": path.name,
            "start": {
                "lat": str(path.start_lat),
                "lng": str(path.start_lng)
            },
            "end": {
                "lat": str(path.end_lat),
                "lng": str(path.end_lng),
            },
            "waypoints": json.loads(path.json)
        }
        json_string = json.dumps(path_dict)
        return HttpResponse(json.dumps(path_dict), content_type="application/json")
    elif request.method == "POST":
        # waypoints is a json
        path_name = request.POST['name']
        # Prevent paths with duplicate names
        # If you want to edit a path, should use a PUT request
        if Path.objects.filter(name=path_name, user=request.user).count() > 0:
            return HttpResponse('Path already exists')
        waypoints = request.POST['waypoints']
        start = json.loads(request.POST['start'])
        end = json.loads(request.POST['end'])
        # get user
        path = Path.objects.create(
            name=path_name,
            json=waypoints,
            user=request.user,
            start_lat=start['d'],
            start_lng=start['e'],
            end_lat=end['d'],
            end_lng=end['e']
            )
        # get a Place for each waypoint
        waypoints = json.loads(waypoints)
        for waypoint in waypoints:
            # We assume that a place exists.
            place = Place.objects.get(google_id=waypoint['id'])
            path.places.add(place)
        path.save() # is this necessary?
        return HttpResponse('success')
    else:
        return HttpResponse('not implemented yet')

def saved_path_page(request):
    # TODO implement display of user paths
    # Should not be able to view this page without being logged in
    c = {}
    c.update(csrf(request))
    return render_to_response('saved_path_page.html', c)

'''
TODO: actually put this in database
Implement getting paths from ID.
Query which paths a user has.
'''
