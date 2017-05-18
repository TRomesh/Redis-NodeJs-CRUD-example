const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphb = require('express-handlebars');
const redis = require('redis');

const port = 3000;

const app = express();
app.engine('handlebars',exphb({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(methodOverride('_method'));

app.listen(port,()=>{
  console.log('Server started on port :'+port);
});
