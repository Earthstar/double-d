from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.template import Template, Context
from django.template.loader import get_template


# Create your views here.
def map_page(request):
	t = get_template('map.html')
	html = t.render(Context({}))
	return HttpResponse(html)
def mapsearch_page(request):
	t = get_template('map_search.html')
	html = t.render(Context({}))
	return HttpResponse(html)