import myModelTmp from '../core/myModelTmp.js';
import {body} from 'express-validator';
import crypto from 'crypto';

function createPassword(string){
    return crypto.createHash('sha1').update(string).digest('hex');
}

export default class userModel extends myModelTmp{
    constructor(){
        super('users');

        //TODO get positions id for validation from positions_list table

        this.userNotFoundErrorMessage = 'email or password is wrong';

        this.typeList = [
            'mentor',
            'mentee'
        ];

        this.loginBody = [
            body('email').notEmpty().trim().withMessage('email and password is require'),
            body('password').notEmpty().trim().withMessage('email and password is require'),
        ];

        this.signInBody = [
            body('name').notEmpty().trim().withMessage('name is require'),
            body('surname').notEmpty().trim().withMessage('surname is require'),
            body('description').trim(),
            body('education').trim(),
            body('experience').trim(),
            body('about').trim(),

            body('position').notEmpty().trim().withMessage('position/specification is require')
                .isIn(["1", "2", "3"]).withMessage('choose from list please "1", "2", "3"'),
            body('type').notEmpty().withMessage('type is require')
                .isIn(['mentor','mentee']).withMessage("choose 'mentor','mentee' only"),
            body('email').isEmail().normalizeEmail().withMessage('please write true email')
                .custom(async value => {
                    return this.findUserByEmail(value).then(user => {
                        if(user) throw new Error('email is exists');
                    });
                }),
            body('password').notEmpty().withMessage('password is require'),
            body('password').isLength({ min: 6 }).withMessage('password min size 6 symbols'),
            body('passwordConfirmation').custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
        ];

        this.updateBody = [
            body('name').notEmpty().trim().withMessage('name is require'),
            body('surname').notEmpty().trim().withMessage('surname is require'),
            body('description').trim(),
            body('education').trim(),
            body('experience').trim(),
            body('about').trim(),
            body('position_id').notEmpty().trim().withMessage('position/specification is require')
                .isIn(["1", "2", "3"]).withMessage('choose from list please "1", "2", "3"'),
            body('type').notEmpty().withMessage('type is require')
                .isIn(['mentor','mentee']).withMessage("choose 'mentor','mentee' only"),
        ];
    }

    async findUserForLogin(email, password){
        let [[user]] = await this.exec(`SELECT id, name, surname, email FROM users WHERE email = '${email}' AND password = '${createPassword(password)}'`);
        return user;
    }

    async findUserByEmail(email){
        let [[user]] = await this.exec(`SELECT email FROM users WHERE email = '${email}'`);
        return user;
    }

    async insert(data){
        let query = `INSERT INTO ${this._table} `;
        query += ` (${[
                    'name', 
                    'surname', 
                    'email', 
                    'password', 
                    'type', 
                    'position_id', 
                    'description', 
                    'education', 
                    'experience', 
                    'about'].join(', ')}) 
                VALUES (
                    '${data.name}',
                    '${data.surname}',
                    '${data.email}',
                    '${createPassword(data.password)}',
                    '${data.type}',
                    ${data.position},
                    '${data.description}',
                    '${data.education}',
                    '${data.experience}',
                    '${data.about}')`;

        await this.exec(query);

        return true;
    }

    async getFilteredUsers(myUserId,data){
        let query = `SELECT * FROM users WHERE users.id != ${myUserId} `;
        let where_array = [];

        console.log(data);

        if(data.name && data.name.length){
            where_array.push(`name = '${data.name}'`);
        }
        if(data.surname && data.name.length){
            where_array.push(`surname = '${data.surname}'`);
        }
        if(data.type && data.name.length){
            where_array.push(`type = '${data.type}'`);
        }
        if(data.date && data.date.length){
            where_array.push(`created_at LIKE '${data.date}%'`);
        }

        if(where_array.length){
            query += 'AND ';
            query += where_array.join(' AND ');
        }


        let [result] = await this.exec(query);

        return result;
    }

    async getById(userId){
        let [[user]] = await this.exec(`SELECT  
              name, 
              surname, 
              type,  
              position_id,  
              education,  
              description,  
              experience,  
              about
            FROM users 
            WHERE id = ${userId}`);

        return user;
    }

    async getUserInfoById(userId){
        let [[user]] = await this.exec(`SELECT  
              name, 
              surname, 
              email, 
              type,  
              positions_list.title AS position_title,  
              education,  
              description,  
              experience,  
              about
            FROM users 
              LEFT JOIN positions_list ON users.position_id = positions_list.id
            WHERE users.id = ${userId}`);

        return user;
    }
}






