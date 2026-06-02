const express = require("express");
const router  = express.Router();
const { librarianController } = require("../controller/librarian");
const { userAuth }  = require("../middlewares/userAuth");
const { checkRole } = require("../middlewares/checkRole");

const staff = [userAuth, checkRole(["admin","librarian"])];

router.get("/bookissued",                  ...staff, librarianController.bookIssued);

router.get("/issuerequest",                ...staff, librarianController.issueRequest);
router.put("/approverequest/:id",          ...staff, librarianController.approveRequest);   
router.put("/rejectrequest/:id",           ...staff, librarianController.rejectRequest);   

router.get("/returnrequest",               ...staff, librarianController.returnRequest);
router.put("/approvereturnrequest/:id",    ...staff, librarianController.approveReturnRequest);
router.put("/rejectreturnrequest/:id",     ...staff, librarianController.rejectReturnRequest);
router.put("/directreturn/:id",            ...staff, librarianController.directReturn);

module.exports = router;
