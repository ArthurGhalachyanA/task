import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import _ from 'lodash';
import ejs from 'ejs';
import ejs_locals_engine from 'ejs-locals';
import { fileURLToPath } from 'url';
import myController from './core/MyController.js';

const app = express();
const port = process.env.PORT || 7000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('ejs', ejs_locals_engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw());
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(fileUpload({ createParentPath: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.get('/favicon.ico', (req, res) => res.status(204));

myController(app);

app.listen(port, () => {console.log(`listening at http://localhost:${port}`)});


