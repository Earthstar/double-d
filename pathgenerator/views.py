from django.shortcuts import render
from django.template import Template, Context
from django.http import HttpResponse
from django.template.loader import get_template

# Create your views here.
def map_page(request):
	t = get_template('map.html')
	html = t.render(Context({}))
	return HttpResponse(html)
