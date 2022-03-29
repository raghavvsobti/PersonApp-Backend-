const Person = require("../models/person");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.getPersons = (req, res, next) => {
  Person.find()
    .then((persons) => {
      res.status(200).json({
        code: "00",
        persons: persons,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postPerson = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No Profile Pic provided");
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const dob = req.body.dob;
  const mobileNo = req.body.mobileNo;
  const prefferedLocationChennai = req.body.prefferedLocationChennai;
  const jobType = req.body.jobType;
  const profilePic = req.file.path;

  const person = new Person({
    name: name,
    email: email,
    dob: dob,
    mobileNo: mobileNo,
    prefferedLocationChennai: prefferedLocationChennai,
    jobType: jobType,
    profilePic: profilePic,
  });

  person
    .save()
    .then((result) => {
      res.status(200).json({
        code: "00",
        person: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.getPerson = (req, res, next) => {
  const personId = req.params.personId;
  Person.findById(personId)
    .then((person) => {
      if (!person) {
        const error = new Error("No person found with this id");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        code: "00",
        person: person,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.editPerson = (req, res, next) => {
  const personId = req.params.personId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const dob = req.body.dob;
  const mobileNo = req.body.mobileNo;
  const prefferedLocationChennai = req.body.prefferedLocationChennai;
  const jobType = req.body.jobType;
  let profilePic = req.body.image;

  if (req.file) {
    profilePic = req.file.path;
  }
  if (!profilePic) {
    const error = new Error("No file Picked");
    error.statusCode = 422;
    throw error;
  }

  Person.findById(personId)
    .then((person) => {
      if (!person) {
        const error = new Error("Could not find person");
        error.statusCode = 404;
        throw error;
      }
      if (profilePic !== person.profilePic) {
        clearImage(person.profilePic);
      }

      person.name = name;
      person.email = email;
      person.mobileNo = mobileNo;
      person.prefferedLocationChennai = prefferedLocationChennai;
      person.jobType = jobType;
      person.profilePic = profilePic;
      person.dob = dob;

      return person.save().then((result) => {
        res.status(200).json({
          code: "00",
          person: result,
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.deletePerson = (req, res, next) => {
  const personId = req.params.personId;
  Person.findById(personId)
    .then((person) => {
      if (!person) {
        const error = new Error("No Person found with this id");
        error.statusCode = 422;
        throw error;
      }
      return Person.findByIdAndRemove(personId);
    })
    .then((result) => {
      res.status(200).json({
        code: "00",
        message: "Person removed Successfully",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
