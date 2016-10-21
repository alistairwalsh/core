var hooks = require('hooks');
var chai = require('chai');
var assert = chai.assert;

// Variables for passing results as input to subsequent tests
var job_id = '';
var gear_name = 'test-case-gear';
var group_id = 'test-group';
var delete_group_id = 'example_group';
var test_group_tag = 'test-group-tag';
var collection_id = 'test-collection-1';
var delete_collection_id = '';
var test_collection_1 = null;
var test_collection_tag = 'test-collection-tag';
var test_session_1 = null;
var test_session_2_id = null;
var test_session_tag = 'test-session-tag';
var test_acquisition_1 = null;
var test_acquisition_tag = 'test-acq-tag';
var example_acquisition_id = '';
var test_project_1 = null;
var test_project_tag = 'test-project-tag';
var delete_project_id = '';

// Tests we're skipping, fix these

// Fails only in travis
hooks.skip("GET /version -> 200");

// Should 400 to say invalid json
hooks.skip("GET /download -> 400");

// Should 422 for missing metadata field
hooks.skip("POST /upload/label -> 402");
hooks.skip("POST /upload/uid -> 402");
hooks.skip("POST /upload/uid-match -> 402");

// Should 404
hooks.skip("GET /jobs/{JobId} -> 404");

// Can only retry a failed job
hooks.skip("POST /jobs/{JobId}/retry -> 200");

// https://github.com/cybertk/abao/issues/160
hooks.skip("GET /users/self/avatar -> 307");
hooks.skip("GET /users/{UserId}/avatar -> 307");

// Tests that are skipped because we do them in postman or python

// Skipping because abao doesn't support file fields
hooks.skip("POST /download -> 200");
hooks.skip("GET /download -> 200");
hooks.skip("POST /upload/label -> 200");
hooks.skip("POST /upload/uid -> 200");
hooks.skip("POST /upload/uid-match -> 200");
hooks.skip("POST /upload/uid-match -> 404");
hooks.skip("POST /engine -> 200");
hooks.skip("POST /collections/{CollectionId}/packfile-start -> 200");
hooks.skip("POST /collections/{CollectionId}/packfile -> 200");
hooks.skip("GET /collections/{CollectionId}/packfile-end -> 200");
hooks.skip("POST /sessions/{SessionId}/packfile-start -> 200");
hooks.skip("POST /sessions/{SessionId}/packfile -> 200");
hooks.skip("GET /sessions/{SessionId}/packfile-end -> 200");
hooks.skip("POST /acquisitions/{AcquisitionId}/packfile-start -> 200");
hooks.skip("POST /acquisitions/{AcquisitionId}/packfile -> 200");
hooks.skip("GET /acquisitions/{AcquisitionId}/packfile-end -> 200");
hooks.skip("POST /projects/{ProjectId}/packfile-start -> 200");
hooks.skip("POST /projects/{ProjectId}/packfile -> 200");
hooks.skip("GET /projects/{ProjectId}/packfile-end -> 200");


hooks.beforeEach(function (test, done) {
    test.request.query.root = "true"
    test.request.headers.Authorization = "scitran-user XZpXI40Uk85eozjQkU1zHJ6yZHpix+j0mo1TMeGZ4dPzIqVPVGPmyfeK";
    done();
});

hooks.after("GET /jobs -> 200", function(test, done) {
    job_id = test.response.body[0]._id;
    done();
});

hooks.before("GET /jobs/{JobId} -> 200", function(test, done) {
    test.request.params = {
        JobId: job_id
    };
    done();
});

hooks.before("GET /jobs/{JobId}/config.json -> 200", function(test, done) {
    test.request.params = {
        JobId: job_id
    };
    done();
});


hooks.before("PUT /jobs/{JobId} -> 200", function(test, done) {
    test.request.params = {
        JobId: job_id
    };
    done();
});

hooks.before("POST /jobs/{JobId}/retry -> 200", function(test, done) {
    test.request.params = {
        JobId: job_id
    };
    done();
});

hooks.before("GET /jobs/{JobId} -> 404", function(test, done) {
    test.request.params = {
        JobId: '57ace4479e512c61bc6e006f' // fake ID, 404
    };
    done();
});

hooks.before("GET /download -> 404", function(test, done) {
    test.request.query = {
        ticket: '1234'
    };
    done();
});

hooks.before("POST /users -> 400", function(test, done) {
    test.request.body = {api_key:{key:"test"}};
    done();
});

hooks.before("GET /users/{UserId} -> 200", function(test, done) {
    test.request.params = {
        UserId: "jane.doe@gmail.com"
    };
    done();
});

hooks.before("PUT /users/{UserId} -> 200", function(test, done) {
    test.request.params = {
        UserId: "jane.doe@gmail.com"
    };
    done();
});

hooks.before("PUT /users/{UserId} -> 400", function(test, done) {
    test.request.params = {
        UserId: "jane.doe@gmail.com"
    };
    test.request.body = {"not_a_valid_property":"foo"};
    done();
});

hooks.before("DELETE /users/{UserId} -> 200", function(test, done) {
    test.request.params = {
        UserId: "jane.doe@gmail.com"
    };
    done();
});

hooks.before("GET /gears/{GearName} -> 200", function(test, done) {
    test.request.params = {
        GearName: gear_name
    };
    done();
});

hooks.before("POST /gears/{GearName} -> 200", function(test, done) {
    test.request.params = {
        GearName: gear_name
    };
    done();
});

hooks.before("GET /gears/{GearName} -> 200", function(test, done) {
    test.request.params = {
        GearName: gear_name
    };
    done();
});

hooks.before("PUT /groups/{GroupId} -> 400", function(test, done) {
    test.request.params = {
        GroupId: group_id
    };
    test.request.body = {"not_a_real_property":"foo"};
    done();
});

hooks.before("POST /groups -> 400", function(test, done) {
    test.request.body = {"not_a_real_property":"foo"};
    done();
});


hooks.before("GET /groups/{GroupId} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id
    };
    done();
});

hooks.before("DELETE /groups/{GroupId} -> 200", function(test, done) {
    test.request.params = {
        GroupId: delete_group_id
    };
    done();
});

hooks.before("POST /groups/{GroupId}/roles -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id
    };
    test.request.body = {
        site: "local",
        _id: "test@user.com",
        access: "ro"
    }
    done();
});

hooks.before("POST /groups/{GroupId}/roles -> 400", function(test, done) {
    test.request.params = {
        GroupId: group_id
    };
    test.request.body.foo = "bar";
    done();
});

hooks.before("GET /groups/{GroupId}/roles/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    done();
});

hooks.before("PUT /groups/{GroupId}/roles/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    test.request.body = {
        site: "local",
        _id: "test@user.com",
        access: "admin"
    };
    done();
});

hooks.before("PUT /groups/{GroupId}/roles/{SiteId}/{UserId} -> 400", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        SiteId: "local",
        UserId:"test@user.com"
    };
    test.request.body = {
        site: "local",
        _id: "test@user.com",
        access: "rw",
        not_a_real_property: "foo"
    };
    done();
});

hooks.before("DELETE /groups/{GroupId}/roles/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    done();
});

hooks.before("POST /groups/{GroupId}/tags -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id
    };
    test.request.body = {
        "value":test_group_tag
    };
    done();
});

hooks.before("POST /groups/{GroupId}/tags -> 400", function(test, done) {
    test.request.params = {
        GroupId: group_id
    };
    test.request.body = {
        "value":test_group_tag,
        "bad property": "foo"
    };
    done();
});

hooks.before("GET /groups/{GroupId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        TagValue: test_group_tag
    };
    done();
});

hooks.before("PUT /groups/{GroupId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        TagValue: test_group_tag
    };
    test_group_tag = "a-new-tag";
    test.request.body = {
        "value":test_group_tag
    };
    done();
});

hooks.before("PUT /groups/{GroupId}/tags/{TagValue} -> 400", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        TagValue: test_group_tag
    };
    test.request.body = {
        "value":test_group_tag,
        "bad proeprty":"blah"
    };
    done();
});

hooks.before("DELETE /groups/{GroupId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        GroupId: group_id,
        TagValue: test_group_tag
    };
    done();
});

hooks.after("GET /collections -> 200", function(test, done) {
    test_collection_1 = test.response.body[0];
    collection_id = test.response.body[0]._id;
    delete_collection_id = test.response.body[1]._id;
    done();
});

hooks.before("GET /collections/{CollectionId} -> 200", function(test, done) {
    test.request.params.CollectionId = collection_id;
    done();
});

hooks.before("GET /collections/{CollectionId}/sessions -> 200", function(test, done) {
    test.request.params.CollectionId = collection_id;
    done();
});

hooks.before("GET /collections/{CollectionId}/acquisitions -> 200", function(test, done) {
    test.request.params.CollectionId = collection_id;
    done();
});

hooks.before("POST /collections -> 400", function(test, done) {
    test.request.params.CollectionId = collection_id;
    test.request.body.foo = "not an allowed property";
    done();
});

hooks.before("PUT /collections/{CollectionId} -> 400", function(test, done) {
    test.request.params.CollectionId = collection_id;
    test.request.body.foo = "not an allowed property";
    done();
});

hooks.before("DELETE /collections/{CollectionId} -> 200", function(test, done) {
    test.request.params.CollectionId = delete_collection_id;
    done();
});

hooks.before("POST /collections/{CollectionId}/tags -> 200", function(test, done) {
    test.request.params.CollectionId = collection_id;
    test.request.body = {
        "value":test_collection_tag
    };
    done();
});

hooks.before("POST /collections/{CollectionId}/tags -> 400", function(test, done) {
    test.request.params.CollectionId = collection_id;
    test.request.body = {
        "value":""
    };
    done();
});

hooks.before("GET /collections/{CollectionId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        TagValue : test_collection_tag
    };
    done();
});

hooks.before("PUT /collections/{CollectionId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        TagValue : test_collection_tag
    };
    test_collection_tag = "new-tag-value";
    test.request.body = {
        "value":test_collection_tag
    };
    done();
});

hooks.before("PUT /collections/{CollectionId}/tags/{TagValue} -> 400", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        TagValue : test_collection_tag
    };
    test.request.body = {
        "value":""
    };
    done();
});

hooks.before("DELETE /collections/{CollectionId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        TagValue : test_collection_tag
    };
    done();
});

hooks.before("GET /collections/{CollectionId}/files/{FileName} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        FileName : "notes.txt"
    };
    test.request.query = {
        "ticket":""
    };
    done();
});

hooks.before("POST /collections/{CollectionId}/permissions -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id
    };
    test.request.body = {
        "_id":"test@user.com",
        "site":"local",
        "access":"ro"
    };
    done();
});

hooks.before("POST /collections/{CollectionId}/permissions -> 400", function(test, done) {
    test.request.params = {
        CollectionId : collection_id
    };
    test.request.body = {
        "not a valid":"permissions entry"
    };
    done();
});

hooks.before("GET /collections/{CollectionId}/permissions/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    done();
});

hooks.before("PUT /collections/{CollectionId}/permissions/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    test.request.body = {
        "site":"local",
        "access":"rw",
        "_id":"test@user.com"
    };
    done();
});

hooks.before("PUT /collections/{CollectionId}/permissions/{SiteId}/{UserId} -> 400", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    test.request.body = {
        "not a valid":"permissions entry"
    };
    done();
});

hooks.before("DELETE /collections/{CollectionId}/permissions/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    done();
});

hooks.before("POST /collections/{CollectionId}/notes -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id
    };
    done();
});

hooks.before("POST /collections/{CollectionId}/notes -> 400", function(test, done) {
    test.request.params = {
        CollectionId : collection_id
    };
    test.request.body = {
        "not real":"property"
    };
    done();
});

hooks.before("GET /collections/{CollectionId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        NoteId: test_collection_1.notes[0]._id
    };
    done();
});

hooks.before("PUT /collections/{CollectionId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        NoteId: test_collection_1.notes[0]._id
    };
    test.request.body = {
        "text":"new note"
    };
    done();
});

hooks.before("PUT /collections/{CollectionId}/notes/{NoteId} -> 400", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        NoteId: test_collection_1.notes[0]._id
    };
    test.request.body = {
        "note a":"real property"
    };
    done();
});

hooks.before("DELETE /collections/{CollectionId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        CollectionId : collection_id,
        NoteId: test_collection_1.notes[0]._id
    };
    done();
});

hooks.after("GET /sessions -> 200", function(test, done) {
    test_session_1 = test.response.body[0];
    assert.equal(test_session_1.label, "test-session-1");
    done();
});

hooks.before("GET /sessions/{SessionId} -> 200", function(test, done) {
    test.request.params.SessionId = test_session_1._id;
    done();
});

hooks.before("POST /sessions -> 200", function(test, done) {
    test.request.body.project = test_session_1.project;
    done();
});

hooks.after("POST /sessions -> 200", function(test, done) {
    test_session_2_id = test.response.body._id
    done();
});


hooks.before("POST /sessions -> 400", function(test, done) {
    test.request.body.foo = "not an allowed property";
    test.request.body.project = test_session_1.project;
    done();
});

hooks.before("PUT /sessions/{SessionId} -> 200", function(test, done) {
    test.request.params.SessionId = test_session_1._id;
    test.request.body = {
        project: test_session_1.project,
        label: "new-label-test-session-1"
    };
    done();
});

hooks.before("PUT /sessions/{SessionId} -> 400", function(test, done) {
    test.request.params.SessionId = test_session_1._id;
    test.request.body = {
        project: test_session_1.project,
        "not_a_real_property": "new-label-test-session-1"
    };
    done();
});

hooks.before("DELETE /sessions/{SessionId} -> 200", function(test, done) {
    test.request.params.SessionId = test_session_2_id;
    done();
});


hooks.before("GET /sessions/{SessionId}/jobs -> 200", function(test, done) {
  test.request.params.SessionId = test_session_1._id;
  done();
});

hooks.before("POST /sessions/{SessionId}/tags -> 200", function(test, done) {
  test.request.params.SessionId = test_session_1._id;
  test.request.body = {
      value: test_session_tag
  };
  done();
});

hooks.before("POST /sessions/{SessionId}/tags -> 400", function(test, done) {
  test.request.params.SessionId = test_session_1._id;
  test.request.body = {
      value: ""
  };
  done();
});

hooks.before("GET /sessions/{SessionId}/tags/{TagValue} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      TagValue: test_session_tag
  };
  done();
});

hooks.before("PUT /sessions/{SessionId}/tags/{TagValue} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      TagValue: test_session_tag
  };
  test_session_tag = 'new-tag-value';
  test.request.body = {
      value: test_session_tag
  };
  done();
});

hooks.before("PUT /sessions/{SessionId}/tags/{TagValue} -> 400", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      TagValue: test_session_tag
  };
  test.request.body = {
      value: ""
  };
  done();
});

hooks.before("DELETE /sessions/{SessionId}/tags/{TagValue} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      TagValue: test_session_tag
  };
  done();
});

hooks.before("GET /sessions/{SessionId}/files/{FileName} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      FileName : "notes.txt"
  };
  test.request.query = {
      "ticket":""
  };
  done();
});

hooks.before("POST /sessions/{SessionId}/notes -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id
  };
  test.request.body = {
      "text":"test note"
  };
  done();
});

hooks.before("POST /sessions/{SessionId}/notes -> 400", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id
  };
  test.request.body = {
      "note a real":"property"
  };
  done();
});

hooks.before("GET /sessions/{SessionId}/notes/{NoteId} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      NoteId: test_session_1.notes[0]._id
  };
  done();
});

hooks.before("PUT /sessions/{SessionId}/notes/{NoteId} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      NoteId: test_session_1.notes[0]._id
  };
  test.request.body = {
      "text":"new note"
  };
  done();
});

hooks.before("PUT /sessions/{SessionId}/notes/{NoteId} -> 400", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      NoteId: test_session_1.notes[0]._id
  };
  test.request.body = {
      "not a real":"property"
  };
  done();
});

hooks.before("DELETE /sessions/{SessionId}/notes/{NoteId} -> 200", function(test, done) {
  test.request.params = {
      SessionId : test_session_1._id,
      NoteId: test_session_1.notes[0]._id
  };
  done();
});


hooks.after("GET /acquisitions -> 200", function(test, done) {
    test_acquisition_1 = test.response.body[0];
    assert.equal(test_acquisition_1.label, "test-acquisition-1");
    done();
});

hooks.before("GET /acquisitions/{AcquisitionId} -> 200", function(test, done) {
    test.request.params.AcquisitionId = test_acquisition_1._id;
    done();
});

hooks.before("POST /acquisitions -> 200", function(test, done) {
    test.request.body.session = test_session_1._id;
    done();
});

hooks.after("POST /acquisitions -> 200", function(test, done) {
    example_acquisition_id = test.response.body._id;
    done();
});

hooks.before("POST /acquisitions -> 400", function(test, done) {
    test.request.body.session = test_session_1._id;
    test.request.body.foo = "bar";
    done();
});

hooks.before("PUT /acquisitions/{AcquisitionId} -> 200", function(test, done) {
    test.request.params.AcquisitionId = test_acquisition_1._id;
    test.request.body = {"label":"test-acquisition-1-new-label"};
    done();
});


hooks.before("PUT /acquisitions/{AcquisitionId} -> 400", function(test, done) {
    test.request.params.AcquisitionId = test_acquisition_1._id;
    test.request.body = {"not-real":"an invalid property"};
    done();
});

hooks.before("DELETE /acquisitions/{AcquisitionId} -> 200", function(test, done) {
    test.request.params.AcquisitionId = example_acquisition_id;
    done();
});

hooks.before("POST /acquisitions/{AcquisitionId}/tags -> 200", function(test, done) {
    test.request.params.AcquisitionId = test_acquisition_1._id;
    test.request.body = {
        "value": test_acquisition_tag
    };
    done();
});

hooks.before("POST /acquisitions/{AcquisitionId}/tags -> 400", function(test, done) {
    test.request.params.AcquisitionId = test_acquisition_1._id;
    test.request.body = {
        "value": test_acquisition_tag,
        "bad property": "not a real property"
    };
    done();
});

hooks.before("GET /acquisitions/{AcquisitionId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        TagValue : test_acquisition_tag
    };
    done();
});

hooks.before("PUT /acquisitions/{AcquisitionId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        TagValue : test_acquisition_tag
    };
    test_acquisition_tag = "new-tag-value";
    test.request.body = {
        "value": test_acquisition_tag
    };
    done();
});

hooks.before("PUT /acquisitions/{AcquisitionId}/tags/{TagValue} -> 400", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        TagValue : test_acquisition_tag
    };
    test.request.body = {
        "value": test_acquisition_tag,
        "bad property": "not a real property"
    };
    done();
});

hooks.before("DELETE /acquisitions/{AcquisitionId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        TagValue : test_acquisition_tag
    };
    done();
});

hooks.before("GET /acquisitions/{AcquisitionId}/files/{FileName} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        FileName : "test-1.dcm"
    };
    test.request.query = {
        "ticket":""
    };
    done();
});

hooks.before("POST /acquisitions/{AcquisitionId}/notes -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id
    };
    done();
});

hooks.before("POST /acquisitions/{AcquisitionId}/notes -> 400", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id
    };
    test.request.body.not_real = "invalid property";
    done();
});

hooks.before("GET /acquisitions/{AcquisitionId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        NoteId: test_acquisition_1.notes[0]._id
    };
    done();
});

hooks.before("PUT /acquisitions/{AcquisitionId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        NoteId: test_acquisition_1.notes[0]._id
    };
    test.request.body = {
        "text":"updated note text"
    };
    done();
});

hooks.before("PUT /acquisitions/{AcquisitionId}/notes/{NoteId} -> 400", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        NoteId: test_acquisition_1.notes[0]._id
    };
    test.request.body = {
        "invalid property":"specified"
    };
    done();
});

hooks.before("DELETE /acquisitions/{AcquisitionId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        AcquisitionId : test_acquisition_1._id,
        NoteId: test_acquisition_1.notes[0]._id
    };
    done();
});

hooks.after("GET /projects -> 200", function(test, done) {
    test_project_1 = test.response.body[0];
    assert.equal(test_project_1.label, "test-project-1");
    done();
});

hooks.after("POST /projects -> 200", function(test, done) {
    delete_project_id = test.response.body._id;
    done();
});

hooks.before("POST /projects -> 400", function(test, done) {
    test.request.body.not_real = "an invalid property";
    done();
});

hooks.before("GET /projects/{ProjectId} -> 200", function(test, done) {
    test.request.params.ProjectId = test_project_1._id;
    done();
});

hooks.before("PUT /projects/{ProjectId} -> 400", function(test, done) {
    test.request.params.ProjectId = test_project_1._id;
    test.request.body = {"not_real":"fake property"};
    done();
});

hooks.before("DELETE /projects/{ProjectId} -> 200", function(test, done) {
    test.request.params.ProjectId = delete_project_id;
    done();
});

hooks.before("POST /projects/{ProjectId}/tags -> 200", function(test, done) {
    test.request.params.ProjectId = test_project_1._id;
    test.request.body = {
        "value":test_project_tag
    };
    done();
});

hooks.before("POST /projects/{ProjectId}/tags -> 400", function(test, done) {
    test.request.params.ProjectId = test_project_1._id;
    test.request.body = {
        "value":""
    };
    done();
});

hooks.before("GET /projects/{ProjectId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        TagValue : test_project_tag
    };
    done();
});

hooks.before("PUT /projects/{ProjectId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        TagValue : test_project_tag
    };
    test_project_tag = "new-tag-value";
    test.request.body = {
        "value":test_project_tag
    };
    done();
});

hooks.before("PUT /projects/{ProjectId}/tags/{TagValue} -> 400", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        TagValue : test_project_tag
    };
    test.request.body = {
        "value":""
    };
    done();
});

hooks.before("DELETE /projects/{ProjectId}/tags/{TagValue} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        TagValue : test_project_tag
    };
    done();
});

hooks.before("GET /projects/{ProjectId}/files/{FileName} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        FileName : "notes.txt"
    };
    test.request.query = {
        "ticket":""
    };
    done();
});

hooks.before("POST /projects/{ProjectId}/permissions -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id
    };
    test.request.body = {
        "_id":"test@user.com",
        "site":"local",
        "access":"ro"
    };
    done();
});

hooks.before("POST /projects/{ProjectId}/permissions -> 400", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id
    };
    test.request.body = {
        "not a valid":"permissions entry"
    };
    done();
});

hooks.before("GET /projects/{ProjectId}/permissions/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    done();
});

hooks.before("PUT /projects/{ProjectId}/permissions/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    test.request.body = {
        "site":"local",
        "access":"rw",
        "_id":"test@user.com"
    };
    done();
});

hooks.before("PUT /projects/{ProjectId}/permissions/{SiteId}/{UserId} -> 400", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    test.request.body = {
        "not a valid":"permissions entry"
    };
    done();
});

hooks.before("DELETE /projects/{ProjectId}/permissions/{SiteId}/{UserId} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        SiteId: "local",
        UserId: "test@user.com"
    };
    done();
});

hooks.before("POST /projects/{ProjectId}/notes -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id
    };
    test.request.body = {
        "text":"test note"
    };
    done();
});

hooks.before("POST /projects/{ProjectId}/notes -> 400", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id
    };
    test.request.body = {
        "not a real":"property"
    };
    done();
});

hooks.before("GET /projects/{ProjectId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        NoteId: test_project_1.notes[0]._id
    };
    done();
});

hooks.before("PUT /projects/{ProjectId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        NoteId: test_project_1.notes[0]._id
    };
    test.request.body = {
        "text":"updated note"
    };
    done();
});

hooks.before("PUT /projects/{ProjectId}/notes/{NoteId} -> 400", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        NoteId: test_project_1.notes[0]._id
    };
    test.request.body = {
        "not a real":"property"
    };
    done();
});

hooks.before("DELETE /projects/{ProjectId}/notes/{NoteId} -> 200", function(test, done) {
    test.request.params = {
        ProjectId : test_project_1._id,
        NoteId: test_project_1.notes[0]._id
    };
    done();
});
