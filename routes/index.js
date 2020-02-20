var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require("path");
var upload = multer({
  dest: "uploads/"
})


var movieController = require("../controller/movieController")



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/uploads"))
  },
  filename: function (req, file, cb) {
    let filename = file.originalname;
    let fileExtention = filename.split('.').pop();
    file.originalname = Date.now() + "." + fileExtention;
    cb(null, file.originalname)
  }
})
var upload = multer({
  storage: storage
})



router.get('/', movieController.viewIndex);



// login restrict
// =>
router.get('/movie/new', movieController.renderAddForm) 
router.get('/movie/:id/edit', movieController.renderEditForm) //edit form

//database implements  => basic crud implemantation
router.post("/movie/add", upload.single("imgSrc"), movieController.addIntoTheDatabase);
router.post("/movie/:id/edit", upload.single("imgSrc"), movieController.editTheMovie);
router.get("/movie/:id/", movieController.renderViewMovie);

router.get("/movie/:id/delete", movieController.deleteFromTheDatabase);



//comment operation
router.post("/movie/:id/comment", movieController.addComment)


module.exports = router;