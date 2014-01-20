from django.contrib.auth.models import User
from django.forms import ModelForm
from django.db import models


# There is a "proper" way to add a field, but it's more complicated
# See: http://www.djangobook.com/en/2.0/chapter10.html
# section Making Changes to a Database Schema
# drops all tables. Useful if you've added a field to a model
# ./manage.py sqlclear pathgenerator | ./manage.py dbshell

# Users can store many Paths (which can be shared?)
# Each path contains a list of Places and a name
# Places can be in multiple Paths and must be ordered in a Path

class Place(models.Model):
    '''
    Represents a place that could be added to a path
    A Place has a latitude, longitude, an address, a name, and tags
    Not implementing events
    Not sure if case matters
    TODO: add ratings

    Can create a place thru a user?
    '''
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    # Only looking at string-formatted address for now
    address = models.TextField()
    name = models.TextField()
    # where we got the place data. ex 'google', 'opensource', 'user', etc.
    source = models.TextField(blank=True)
    # Use this field to store Google's reference value
    google_reference = models.TextField(blank=True)
    google_id = models.TextField(blank=True)
    # Use this to store total data, ex the Json from Google API
    # Just in case we need to extract another field for the DB
    raw_data = models.TextField(blank=True)

    def __unicode__(self):
        '''
        What gets displayed when you print the place.
        '''
        return '{0}, {1}'.format(str(self.name), str(self.address))

    def is_same_place(self, place):
        '''
        Returns True if places are the same. Returns false otherwise.
        place is a Place object.
        '''
        if self.google_id == place.google_id:
            return True
        elif self.google_reference == place.google_reference:
            return True
        elif (self.latitude == place.latitude) and (self.longitude == place.longitude):
            return True
        else:
            return False

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
    Eac path belongs to only one user. If two users "share" a path,
    you need to add
    Use that?
    To find a particular path, use the id field
    path = Path.objects.get(id=1)
    To get all the places on a path,
    places = path.places.all()

    '''
    name = models.TextField()
    places = models.ManyToManyField(Place)
    # The json which is returned when Google routes a path
    json = models.TextField(blank=True)
    # The starting and ending points of a path
    start_lat = models.DecimalField(max_digits=9, decimal_places=6)
    start_lon = models.DecimalField(max_digits=9, decimal_places=6)
    end_lat = models.DecimalField(max_digits=9, decimal_places=6)
    end_lon = models.DecimalField(max_digits=9, decimal_places=6)
    # The user who owns a path. many-to-one relationship with User
    user = models.ForeignKey(User, blank=True)

    def __unicode__(self):
        return self.name

class UserForm(ModelForm):
    '''
    A form linked to a user.
    Automatically creates a form with 3 fields.
    To use:
    form = UserForm()
    return render(request, 'adduser.html', {'form': form})

    In the template file, you can just have:
    {{form}}

    Note that django requires the field {% csrf_token %} to be in the form
    '''
    class Meta:
        model = User
        fields = ('username', 'email', 'password')