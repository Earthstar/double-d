from django.db import models
from ordered_model.models import OrderedModel


# There is a "proper" way to add a field, but it's more complicated
# See: http://www.djangobook.com/en/2.0/chapter10.html
# section Making Changes to a Database Schema
# drops all tables. Useful if you've added a field to a model
# python manage.py sqlclear pathgenerator | python manage.py dbshell

# Users can store many Paths (which can be shared?)
# Each path contains a list of Places and a name
# Places can be in multiple Paths and must be ordered in a Path

class Place(models.Model):
    '''
    Represents a place that could be added to a path
    A Place has a latitude, longitude, an address, a name, and tags
    Not implementing events
    Not sure if case matters
    '''
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    # Only looking at string-formatted address for now
    address = models.TextField()
    name = models.TextField()
    # Use this field to store Google's reference value
    google_reference = models.TextField(blank=True)
    # Use this to store total data, ex the Json from Google API
    # Just in case we need to extract another field for the DB
    raw_data = models.TextField(blank=True)

    def __unicode__(self):
        '''
        What gets displayed when you print the place.
        '''
        return '{0}, {1}'.format(str(self.name) + str(self.address))

class Tag(models.Model):
    '''
    Represents a feature of a place.
    Each tag may belong to multiple places and vice versa
    all characters are lowercase
    '''
    tag = models.TextField()
    places = models.ManyToManyField(Place)

    def __unicode__(self):
        return self.tag

# Create model that stores a path
class Path(models.Model):
    '''
    Represents an ordered list of places that make a path.
    Django models automatically get an autoincrementing id field
    which is created when you save the model.
    Use that?
    To find a particular path, use the id field
    path = Path.objects.get(id=1)
    To get all the places on a path,
    places = path.places.all()
    To get the ordering of places, filter PlaceOrdering
    PlaceOrdering.objects.filter(path_id__exact=1, place_id__exact=1)
    Is there a better way of doing this?
    '''
    name = models.TextField()
    places = models.ManyToManyField(Place)
    # The json which is returned when Google routes a path
    json = models.TextField(blank=True)

    def __unicode__(self):
        return self.name