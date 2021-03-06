"""
Gears
"""

# import jsonschema
from jsonschema import Draft4Validator
import gear_tools

from .. import config
from .jobs import Job
from ..dao.containerstorage import ContainerStorage

log = config.log

def get_gears(fields=None):
    """
    Fetch the install-global gears from the database
    """

    projection = { }

    if fields is None:
        return config.db.gears.find()
    else:
        fields.append('gear.name')

    for f in fields:
        projection[f] = 1

    return config.db.gears.find({}, projection)

def get_gear_by_name(name):

    # Find a gear from the list by name
    gear_doc = config.db.gears.find_one({'gear.name': name})

    if gear_doc is None:
        raise Exception('Unknown gear ' + name)

    return gear_doc

def get_invocation_schema(gear):
    return gear_tools.derive_invocation_schema(gear['gear'])

def suggest_container(gear, cont_name, cid):
    """
    Given a container reference, suggest files that would work well for each input on a gear.
    """

    root = ContainerStorage.factory(cont_name, True).get_container(cid, projection={'permissions':0}, get_children=True)
    invocation_schema = get_invocation_schema(gear)

    schemas = {}
    for x in gear['gear']['inputs']:
        schema = gear_tools.isolate_file_invocation(invocation_schema, x)
        schemas[x] = Draft4Validator(schema)

    # It would be nice to have use a visitor here instead of manual key loops.
    for acq in root.get('acquisitions', []):
        for f in acq.get('files', []):
            f['suggested'] = {}
            for x in schemas:
                f['suggested'][x] = schemas[x].is_valid(f)

    for analysis in root.get('analyses',{}):
        files = analysis.get('files', [])
        files[:] = [x for x in files if x.get('output')]
        for f in files:
            f['suggested'] = {}
            for x in schemas:
                f['suggested'][x] = schemas[x].is_valid(f)
        analysis['files'] = files

    return root

def insert_gear(doc):
    gear_tools.validate_manifest(doc['gear'])

    # This can be mongo-escaped and re-used later
    if doc.get("invocation-schema"):
        del(doc["invocation-schema"])

    config.db.gears.insert(doc)

    if config.get_item('queue', 'prefetch'):
        log.info('Queuing prefetch job for gear ' + doc['gear']['name'])

        job = Job(doc['gear']['name'], {}, destination={}, tags=['prefetch'], request={
            'inputs': [
                {
                    'type': 'http',
                    'uri': doc['exchange']['rootfs-url'],
                    'vu': 'vu0:x-' + doc['exchange']['rootfs-hash']
                }
            ],
            'target': {
                'command': ['uname', '-a'],
                'env': {
                    'PATH': '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
                },
            },
            'outputs': [ ],
        })
        return job.insert()

def remove_gear(name):
    config.db.gears.remove({'gear.name': name})

def upsert_gear(doc):
    gear_tools.validate_manifest(doc['gear'])

    remove_gear(doc['gear']['name'])
    insert_gear(doc)
