var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

//connect mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin1:conghuy090701@demo-cluster.sxe9c.mongodb.net/ManagerStudent?retryWrites=true&w=majority', function(err){
    if(err){
        console.log("Mongo conect error:" + err);
    }else{
        console.log("Mongo conected.");
    }
});



//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Models
var Student = require("./models/student");

//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imageStudent");

app.get("/add", function(req, res){
    res.render("add");
});

app.post("/add", function(req, res){
    //add file
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({"kq":0, "errMsg": "A Multer error occurred when uploading."})
        } else if (err) {
            res.json({"kq":0, "errMsg": "An unknown error occurred when uploading."+ err})
        }else{
            //save mongo (req.file.filename)
            var student1 = Student({
                Name: req.body.textName,
                Age: req.body.numberAge,
                Class: req.body.textClass,
                Date: req.body.textDate,
                Image: req.file.filename,
            });
            student1.save(function(err){
                if(err){
                    res.json({"kq":0, "errMsg": err})
                }else{
                    res.redirect("./list");
                    
                }
            });
        };
    });
});


//danh sach

app.get("/list", function(req, res){
    Student.find(function(err, data){
        if(err){
            res.json({"kp":0, "errMsg": err});
        }else{
            res.render("list", {danhsach:data})
        }
    })
});


//edit
app.get("/edit/:id", function(req, res){
    Student.findById(req.params.id, function(err, char){
        if(err){
            res.json({"kp":0, "errMsg": err});
        }else{
            console.log(char)
            res.render("edit", {nhanvat:char});
        }
    });
});

app.post("/edit", function(req, res){

    upload(req, res, function (err) {
        //uplaod no file
        if(!req.file){
            Student.updateOne({_id:req.body.IDChar}, {
                Name: req.body.textName,
                Age: req.body.numberAge,
                Class: req.body.textClass,
                Date: req.body.textDate,
            }, function(err){
                if(err){
                    res.json({"kp":0, "errMsg": err});
                }else{
                    res.redirect("./list");
                }
            });
        }else{
            //upload file
            if (err instanceof multer.MulterError) {
                res.json({"kq":0, "errMsg": "A Multer error occurred when uploading."})
            } else if (err) {
                res.json({"kq":0, "errMsg": "An unknown error occurred when uploading."+ err})
            }else{
                //upload mongo (req.file.filename)
                Student.updateOne({_id:req.body.IDChar}, {
                    Name: req.body.textName,
                    Age: req.body.numberAge,
                    Class: req.body.textClass,
                    Date: req.body.textDate,
                    Image: req.file.filename,
                }, function(err){
                    if(err){
                        res.json({"kp":0, "errMsg": err});
                    }else{
                        res.redirect("./list");
                    }
                });
            };
        }
    });
});


//delete profile

app.get("/delete/:id", function(req, res){
    Student.deleteOne({_id:req.params.id}, function(err){
        if(err){
            res.json({"kq":0, "errMsg":err});
        }else{
            res.redirect("../list");
        }
    })
})