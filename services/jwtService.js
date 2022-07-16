import jwt from 'jsonwebtoken';

export default class jwtService{
    constructor(){
        //TODO move this config to config file

        this.secret = '1f8cf512d2c24a7649dc8ea325520524a3faa83fcd831422c302b7039ec364b827c3827a73219da05feea1ff28ccf6321b1c75f386a7f6711536a2bc97451648';
        this.secretExpairIn = '1d';
        this.refreshSecret = '1784cf761dea0215eb83834976ccb14091361729e893c883a0ff4427e6299dcc1b86dcaf33963950d0e0e61923d711f1744ce92fd7a8b9e41019e3ec777b3607';
        this.refreshSecretExpairIn = '1d';
    }

    validateAccess(accessToken){
        return new Promise((resolve) => {
            jwt.verify(accessToken, this.secret, (err, authUser) => {
                if (err)
                    return resolve({ error: true });
                resolve({error: false, authUser});
            });
        });
    }

    validateRefresh(refreshToken){
        return new Promise((resolve) => {
            jwt.verify(refreshToken, this.refreshSecret, (err, authUser) => {
                if (err)
                    return resolve({ error: true, message: "Invalid refresh token" });
                resolve({error: false, authUser});
            });
        });
    }

    mySign(object){
        const accessToken = jwt.sign(object, this.secret, { expiresIn: this.secretExpairIn});
        const refreshToken = jwt.sign(object, this.refreshSecret, { expiresIn: this.refreshSecretExpairIn});

        return {accessToken, refreshToken}
    }

}