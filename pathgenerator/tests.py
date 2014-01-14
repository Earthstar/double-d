from django.contrib.auth.models import Group, Permission, User
from django.test import TestCase

from guardian.shortcuts import assign_perm

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

    def test_guardian(self):
        user1 = User.objects.create_user("Harry", "foo@bar.com", 'password')
        user2 = User.objects.create_user("Draco", "foo@bar.com", 'password')
        path1 = pg.Path.objects.create(name="Gryffindor", json="")
        path2 = pg.Path.objects.create(name="Slytherin", json="")
        self.assertFalse(user1.has_perm('add_path', path1))
        self.assertFalse(user1.has_perm('add_path', path2))
        assign_perm('add_path', user1, path1)
        self.assertTrue(user1.has_perm('add_path', path1))
        self.assertFalse(user1.has_perm('add_path', path2))
        self.assertFalse(user2.has_perm('add_path', path1))
