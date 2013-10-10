var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

StudentController = function(host, port) {
  this.db= new Db('student_info', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


StudentController.prototype.getCollection= function(callback) {
  this.db.collection('students', function(error, student_collection) {
    if( error ) callback(error);
    else callback(null, student_collection);
  });
};

//find all students
StudentController.prototype.findAll = function(callback) {
    this.getCollection(function(error, student_collection) {
      if( error ) callback(error)
      else {
        student_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an student by ID
StudentController.prototype.findById = function(id, callback) {
    this.getCollection(function(error, student_collection) {
      if( error ) callback(error)
      else {
        student_collection.findOne({_id: student_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new student
StudentController.prototype.save = function(students, callback) {
    this.getCollection(function(error, student_collection) {
      if( error ) callback(error)
      else {
        if( typeof(students.length)=="undefined")
          students = [students];

        for( var i =0;i< students.length;i++ ) {
          student = students[i];
          student.created_at = new Date();
        }

        student_collection.insert(students, function() {
          callback(null, students);
        });
      }
    });
};

// update an student
StudentController.prototype.update = function(studentId, students, callback) {
    this.getCollection(function(error, student_collection) {
      if( error ) callback(error);
      else {
        student_collection.update(
{_id: student_collection.db.bson_serializer.ObjectID.createFromHexString(studentId)},
students,
function(error, students) {
if(error) callback(error);
else callback(null, students)
});
      }
    });
};

//delete student
StudentController.prototype.delete = function(studentId, callback) {
this.getCollection(function(error, student_collection) {
if(error) callback(error);
else {
student_collection.remove(
{_id: student_collection.db.bson_serializer.ObjectID.createFromHexString(studentId)},
function(error, student){
if(error) callback(error);
else callback(null, student)
});
}
});
};

exports.StudentController = StudentController;
