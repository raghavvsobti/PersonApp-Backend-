const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const personController = require("../controllers/person");

router.get("", personController.getPersons);

router.post(
  "",
  [body("name").trim().isLength({ min: 3, max: 25 })],
  personController.postPerson
);

router.get("/:personId", personController.getPerson);

router.put(
  "/:personId",
  [body("name").trim().isLength({ min: 3, max: 25 })],
  personController.editPerson
);

router.delete("/:personId", personController.deletePerson);

module.exports = router;
