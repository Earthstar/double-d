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
    address = models.CharField(max_length=255)
    name = models.CharField(max_length=255)


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
    tag = models.CharField(max_length=255)
    place = models.ManyToManyField(Place)

    def __unicode__(self):
        return self.tag