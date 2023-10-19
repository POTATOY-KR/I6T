import './loadenv.js';
import express from 'express';
import routes from './routes/index.js';
import path from 'node:path'
import { fileURLToPath } from 'url';
const app = express(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',function(req,res){
    res.render('index',{px: 37.4737810, py: 126.6215880});
});

app.post('/', function (req, res) { 
  var datax = req.body.px;
  var datay = req.body.py;
  if(isNaN(datax)){
    datax = 37.4737810;
  }
  if(isNaN(datay)){
    datay = 126.6215880;
  }
  res.render('index', {px: datax, py: datay}); 
});

app.use('/gyms',routes.gym);
app.use('/restaurants',routes.restaurant);

app.get((req,res)=>{
  res.render('404');
});

app.listen(8080, () => console.log("Starting Server Application..."));