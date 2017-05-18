const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphb = require('express-handlebars');
const redis = require('redis');

//create Redis Client
let client = redis.createClient();

client.on('connect',()=>{
  console.log('Connected to Redis....');
});

//set port
const port = 3000;

//init app
const app = express();
// view engine
app.engine('handlebars',exphb({defaultLayout:'main'}));
app.set('view engine','handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//methodOverride
app.use(methodOverride('_method'));

// search page
app.get('/',(req,res,next)=>{
   res.render('searchusers');
});

// search processing
app.get('/user/search',(req,res,next)=>{
  let id = req.query.id;

  client.hgetall(id,(err,obj)=>{
    if(!obj){
      res.render('searchusers',{
         error:'USer does not exist'
       });
    }else{
      obj.id=id;
      res.render('details',{
        user:obj
      })
    }
  });

});

// add userpage
app.get('/user/add',(req,res,next)=>{
 res.render('adduser');
});

// add user
app.post('/user/add',(req,res,next)=>{
 let id=req.body.id;
 let fname=req.body.firstname;
 let lname=req.body.lastname;
 let email=req.body.email;
 let phone=req.body.phone;

 client.hmset(id,[
   'firstname',fname,
   'lastname',lname,
   'email',email,
   'phone',phone
 ],(err,reply)=>{
    if(err){
      console.log(err);
    }else {
      console.log(reply);
      res.redirect('/');
    }
 });
});

//Delete user
app.delete('/user/delete/:id',(req,res,next)=>{
  client.del(req.params.id);
  res.redirect('/');
});

app.listen(port,()=>{
  console.log('Server started on port :'+port);
});
