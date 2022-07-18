import myModelTmp from '../core/myModelTmp.js';

export default class PositionListModel extends myModelTmp{
    constructor(){
        super('positions_list');
        this.activeStatus = 1;
    }

    async getAllPositionsIndexed(status = 1){
        let result = {};
        let [positions] = await this.exec(`SELECT id, title FROM positions_list WHERE status = ${status}`);

        positions.forEach((position) => {
            result[position.id] = position.title;
        });

        return result;
    }

    async findPositionListById(positionId){
        let [[position]] = await this.exec(`SELECT id, title FROM positions_list WHERE id = ${positionId} AND status = ${this.activeStatus}`);

        return position;
    }
}






