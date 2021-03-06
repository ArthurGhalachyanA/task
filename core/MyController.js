import UserController from '../controllers/UserController.js';
import AuthController from '../controllers/AuthController.js';
import JwtService from '../services/JwtService.js';

const jwt = new JwtService();
let tokensList = {};
let authUser;

const accessRoutes = {
    guest:[
        '/login',
        '/sign-in',
        '/token'
    ],
    user:[

    ],
    accessAll:[
        'public'
    ]
};

export default function(app){
    app.use(async (req, res, next) => {
        let jToken = req.headers['j-token'];
        let accessToken = jToken && jToken.split(' ')[1];
        const jwtResult = await jwt.validateAccessGetAuth(accessToken);

        if((jwtResult.error && !accessRoutes.guest.includes(req.url))
            || (!jwtResult.error && accessRoutes.guest.includes(req.url))){

            res.sendStatus(403);
        }else{

            authUser = jwtResult.authUser;
            next();
        }
    });

    app.use(async (req, res, next) => {
        res.authUser = authUser;
        res.tokensList = tokensList;
        res.jwt = jwt;

        res.resData = {
            authorized: !!authUser,
            success: false,
            errors: [],
            tokens: {},
            flashMessage: ''
        };

        AuthController(app);
        UserController(app);

        next();
    });
};

