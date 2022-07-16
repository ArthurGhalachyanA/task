import UserModel from '../models/UserModel.js';
import PositionListModel from '../models/PositionListModel.js';
import JwtService from '../services/jwtService.js';

const jwtService = new JwtService();
const user = new UserModel();

export default function(app){
    app.post('/sign-in', user.signInBody,  async (req, res) => {
        switch(false){
            case user.myValidationRun(req): res.resData.errors.push(user.myGetErrors()); break;
            case await user.insert(req.body): res.resData.errors.push(['insert error']); break;
            default:
                let authUser = await user.findUserForLogin(req.body.email, req.body.password);

                if(!authUser){
                    res.resData.errors.push(['username or password is wrong this is BAD error after insert user not found']);
                }else{
                    res.resData.tokens = jwtService.mySign(authUser);
                    res.resData.success = true;
                    res.resData.authorized = true;
                    res.tokensList[res.resData.tokens.refreshToken] = authUser;
                }
        }

        res.status(200).json(res.resData);
    });

    app.get('/sign-in', async (req, res) => {
        let positionListModel = new PositionListModel();
        res.resData.success = true;
        res.resData.positionsList = await positionListModel.getAllPositionsIndexed();
        res.resData.typeList = user.typeList;

        res.status(200).json(res.resData);
    });

    app.put('/token', async (req, res) => {
        let refreshToken = req.body['r-token'];
        let jwtResult = await jwtService.validateRefresh(refreshToken);

        switch(false){
            case !!res.tokensList[refreshToken]: res.resData.errors.push(['refresh token is wrong']); break;
            case !jwtResult.error: res.resData.errors.push([jwtResult.message]); break;
            default:
                res.resData.tokens = jwtService.mySign(res.tokensList[refreshToken]);
                res.tokensList[res.resData.tokens.refreshToken] = res.tokensList[refreshToken];
                res.resData.authorized = true;
                res.resData.success = true;
                res.resData.flashMessage = 'please update refresh token too';

                delete res.tokensList[refreshToken];
        }

        res.status(200).json(res.resData);
    });

    app.post('/login', user.loginBody,  async (req, res) => {
        switch(false){
            case user.myValidationRun(req): res.resData.errors.push(user.myGetErrors()); break;
            default:
                let authUser = await user.findUserForLogin(req.body.email, req.body.password);

                if(!authUser){
                    res.resData.errors.push([user.userNotFoundErrorMessage]);
                }else{
                    res.resData.tokens = jwtService.mySign(authUser);
                    res.resData.success = true;
                    res.resData.authorized = true;
                    res.tokensList[res.resData.tokens.refreshToken] = authUser;
                }
        }

        res.status(200).json(res.resData);
    });
};