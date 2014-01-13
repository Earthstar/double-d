from django.db import models

# drops all tables. Useful if you've added a field.
# There is a "proper" way to add a field, but it's more complicated
# See: http://www.djangobook.com/en/2.0/chapter10.html
# section Making Changes to a Database Schema
# python manage.py sqlclear pathgenerator | python manage.py dbshell

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
    google_reference = models.TextField()
    # Use this to store total data, ex the Json from Google API
    # Just in case we need to extract another field for the DB
    raw_data = models.TextField()



    def __unicode__(self):
        '''
        What gets displayed when you print the place.
        '''
        return self.name, self.address

class Tag(models.Model):
    '''
    Represents a feature of a place.
    Each tag may belong to multiple places and vice versa
    all characters are lowercase
    Could bootstrap with Google place types
    '''
    tag = models.TextField()
    places = models.ManyToManyField(Place)

    def __unicode__(self):
        return self.tag