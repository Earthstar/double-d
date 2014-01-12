import json

# Idea: use google api to search for places using tags, then cache them
# in database.
# is database necessary?
# Google places have a "reference" feature which can uniquely id places

def create_tag_fixture(filename, pk_start, fixture_name):
    '''
    Creates a django fixture file from a text list of tags
    filename - string, the name of a text file containing tags
    pk_start - int, the number to start generating pk ids. Must be unique across fixtures.
    fixture_name - string, name of file to write
    '''
    f = open(filename, 'r')
    tag_list = []
    for line in f:
        tag_list.append(line.strip())
    f.close()
    json_list = []
    for i in range(len(tag_list)):
        # create a new json object
        tag_dict = {"model": "pathgenerator.tag", "pk": pk_start+i,
            "fields": {
                "tag": tag_list[i],
                "places": []
            }
        }
        json_list.append(tag_dict)
    fixture = open(fixture_name, "w")
    fixture.write(json.dumps(json_list, indent=2, separators=(',', ': ')))
    print json.dumps(json_list, indent=2, separators=(',', ': '))
    fixture.close()

def main():
    create_tag_fixture('google_tags.txt', 100, 'google_tags.json')

if __name__ == '__main__':
    main()