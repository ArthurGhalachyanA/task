import UserModel from '../models/UserModel.js';
import PositionListModel from '../models/PositionListModel.js';
let userModel = new UserModel();

export default function(app){
    app.get('/user/edit', async (req, res) => {
        let positionListModel = new PositionListModel();

        res.resData.user = await userModel.getById(res.authUser.id);
        res.resData.positionsList = await positionListModel.getAllPositionsIndexed();
        res.resData.typeList = userModel.typeList;

        res.json(res.resData);
    });

    app.put('/user/edit', userModel.updateBody,  async (req, res) => {
        switch(false){
            case userModel.myValidationRun(req): res.resData.errors.push(userModel.myGetErrors()); break;
            case await userModel.update(res.authUser.id, req.body): res.resData.errors.push(['update error']); break;
            default:
                res.resData.success = true;
        }

        res.json(res.resData);
    });

    app.get('/user/profile/:id', async (req, res) => {
        let {id} = req.params;
        id = parseInt(id);

        switch(false){
            case !(id === res.authUser.id): res.resData.errors.push(['this is your profile']); break;
            case !!id: res.resData.errors.push(['invalid id']); break;
            default:
                res.resData.data = await userModel.getUserInfoById(id);
                res.resData.success = true;
        }

        res.json(res.resData);
    });

    app.get('/user/search', async (req, res) => {
        let {name, surname, type, date} = req.query;

        res.resData.data = await userModel.getFilteredUsers(res.authUser.id, {name, surname, type, date});
        res.resData.userTypes = userModel.typeList;

        res.json(res.resData);
    });

};






