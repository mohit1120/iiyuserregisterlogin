var express = require('express');
var session = require('express-session');
var mysql = require('mysql');
var bodyparser = require('body-parser');
/*const cors = require('cors');
const fs = require('fs');*/
const v = require('node-input-validator');

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('view engine',"ejs");
app.use(bodyparser.urlencoded({extended:false}));

//Serves resources from public folder
app.use(express.static('public'));
app.use(express.static(__dirname + 'public'));

//databse connection
const sql= mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'kumar@1234',
  database:'muj'
})

sql.connect(function(err){
  if(err) throw err;
  else {
    console.log("successfully connected");
  }
});



//for home page
app.get('/',function(req,res){
  res.render('home');
  })
//for register page
app.get('/register',function(req,res){
res.render('register',{msg: ''});
})
//for login page
app.get('/login',function(req,res){
  res.render('login',{temp: ''});
  })
//for profile page 
app.get('/profile',function(req,res){
  res.render('profile',{tem: ''});
  })
//for home page
app.get('/home',function(req,res){
  res.render('home');
})
//for admin page
app.get('/admin',function(req,res){
  res.render('admin');
})




//for register
app.post("/register",function (req,res)
{
    var select_class = req.body.select_class;
    var name = req.body.name;
    var mobile = req.body.mobile;
    var password = req.body.password;
   
    let q = `insert into users(select_class,name,mobile,password) values("${select_class}","${name}","${mobile}","${password}")`;
    sql.query(q,function(err,result){
        if(err){
          res.render('register',{ msg : "ERROR:Invalid input"})

        }
        else {
          console.log("added successfully");
          res.redirect('login');
        }
    })
})


//for student and admin page login
app.post('/login', function(req, res) {
    var mobile = req.body.mobile;
    var password = req.body.password;
    console.log(password);

    if(mobile == "1234567890" && password=="iiysoftware"){
      res.redirect('admin');
    }

    else if (mobile && password) {
      
        sql.query('SELECT * FROM users WHERE mobile = ?  AND password = ?', [mobile, password], function(err, results, fields) {
            console.log(mobile);
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.mobile = mobile;
                req.session.password = password;
                res.render('profile'/*,{tem: name}*/);
            } else {
            res.render('login',{ temp:"invalid details"});
            
      }
           res.end();
        });
    } else
  {
       res.render('login',{ temp:"Please enter details"});
        res.end();
    }
});





app.listen(8080);
