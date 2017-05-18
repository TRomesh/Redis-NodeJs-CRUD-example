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
app.post('/user/search',(req,res,next)=>{
  let id = req.body.id;

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



app.listen(port,()=>{
  console.log('Server started on port :'+port);
});
