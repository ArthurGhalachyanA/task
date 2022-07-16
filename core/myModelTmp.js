import {validationResult} from 'express-validator';
import mysql from 'mysql2/promise';

export default class myModelTmp{
    constructor(table){
        this.db = mysql;
        this._table = table;
        this.result = [];
        this.myValidationErrors = [];
    }

    myValidationRun(req){
        let errors = validationResult(req).array();

        if(req.method !== 'GET' && errors.length === 0){
            return true;
        }else if(req.method === 'GET'){
            return false;
        }else{
            this.myValidationErrors = errors;
            return false;
        }
    }

    myGetErrors(){
        let errors = this.myValidationErrors;
        this.myValidationErrors = [];

        return errors
    }

    async update(id, data){
        let query = `UPDATE ${this._table} `;
        let fields = [];

        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = '${value}'`);
        }

        query += `SET ${fields.join(', ')} WHERE ${this._table}.id = ${id}`;

        await this.exec(query);

        return true;
    }

    async exec(query){
        const db = await this.connectDB();
        return await db.execute(query);
    }

    async connectDB(){
        return await this.db.createConnection({
            host:'localhost',
            user: 'root',
            database: 'taskDB'
        });
    }
};


