import UserModel from '../models/UserModel.js';
import PositionListModel from '../models/PositionListModel.js';
const userModel = new UserModel();

export default function(app){
    app.post('/sign-in', userModel.signInBody,  async (req, res) => {
        switch(false){
            case userModel.myValidationRun(req): res.resData.errors.push(userModel.myGetErrors()); break;
            case !!await userModel.insert(req.body): res.resData.errors.push([userModel.dbInsertErrorMessage]); break;
            default:
                let authUser = await userModel.findUserForLogin(req.body.email, req.body.password);

                if(authUser){
                    res.resData.tokens = res.jwt.mySign(authUser);
                    res.resData.success = true;
                    res.resData.authorized = true;
                    res.tokensList[res.resData.tokens.refreshToken] = authUser;
                }else{
                    res.resData.errors.push([userModel.unhendlerError]);
                }
        }

        res.status(200).json(res.resData);
    });

    app.get('/sign-in', async (req, res) => {
        let positionListModel = new PositionListModel();
        res.resData.success = true;
        res.resData.positionsList = await positionListModel.getAllPositionsIndexed();
        res.resData.typeList = userModel.typeList;

        res.status(200).json(res.resData);
    });

    app.put('/token', async (req, res) => {
        let refreshToken = req.body['r-token'];
        let jwtResult = await res.jwt.validateRefreshGetAuth(refreshToken);

        switch(false){
            case !!res.tokensList[refreshToken]: res.resData.errors.push([res.jwt.invalidRefreshMessage]); break;
            case !jwtResult.error: res.resData.errors.push([jwtResult.message]); break;
            default:
                res.resData.tokens = res.jwt.mySign(res.tokensList[refreshToken]);
                res.tokensList[res.resData.tokens.refreshToken] = res.tokensList[refreshToken];
                res.resData.authorized = true;
                res.resData.success = true;
                res.resData.flashMessage = 'please update refresh token too';

                delete res.tokensList[refreshToken];
        }

        res.status(200).json(res.resData);
    });

    app.post('/login', userModel.loginBody,  async (req, res) => {
        switch(false){
            case userModel.myValidationRun(req): res.resData.errors.push(userModel.myGetErrors()); break;
            default:
                let authUser = await userModel.findUserForLogin(req.body.email, req.body.password);

                if(authUser){
                    res.resData.tokens = res.jwt.mySign(authUser);
                    res.resData.success = true;
                    res.resData.authorized = true;
                    res.tokensList[res.resData.tokens.refreshToken] = authUser;
                }else{
                    res.resData.errors.push([userModel.userNotFoundErrorMessage]);
                }
        }

        res.status(200).json(res.resData);
    });
};