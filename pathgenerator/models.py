from django.db import models

class Place(models.Model):
    '''
    Represents a place that could be added to a path
    A Place has a latitude, longitude, an address, a name, and tags
    Not implementing events
    '''
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    # Only looking at string-formatted address for now
    address = models.TextField()
    name = models.TextField()
    # Use this to store total data, ex the Json from Google API
    # Just in case we need to extract another field for the DB
    raw_data = models.TextField()



    def __unicode__(self):
        '''
        What gets displayed when you print the place.
        '''
        return self.name, self.address

class Tag:
    '''
    Represents a feature of a place.
    Each tag may belong to multiple places and vice versa
    '''
    tag = models.TextField()
    place = models.ManyToManyField(Place)

    def __unicode__(self):
        return self.tag