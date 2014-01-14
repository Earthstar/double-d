from django.test import TestCase
import pathgenerator.models as pg

class DatabaseTestCase(TestCase):
    '''
    Uses initial_data fixture
    '''

    def setUp(self):
        pass

    def test_calling_path(self):
        '''
        trying to generate a path with ordering
        '''
        # get correct path
        path_name = 'east campus loop'
        path = pg.Path.objects.get(name=path_name)
        self.assertIsNotNone(path)
        # Get all the places in the path
        places = path.places.all() #this will be a QuerySet
        self.assertEqual(3, places.count()) # use count instead of len