from django.conf.urls import patterns, include, url
from django.contrib.auth.views import login

from pathgenerator.views import map_page, mapsearch_page
from streetfarer.views import add_user, secret, logout_page

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^map/$', map_page),
    url(r'^map/search/$', mapsearch_page),
    url(r'^login/$', login),
    url(r'^logout/$', logout_page),
    url(r'^adduser/$', add_user),
    url(r'^secret/$', secret),
    # Examples:
    url(r'^$', 'streetfarer.views.home', name='home'),

    # url(r'^streetfarer/', include('streetfarer.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
