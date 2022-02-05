import { DatabaseConnection } from './DatabaseConnection';
import { schema } from './schema';
import * as config from '../config';

var db = null;

export default class DatabaseInit {

    constructor() {
        DatabaseConnection.getConnection().then((connection) => {
            db = connection;
            this.InitDb();
        });
    }

    InitDb() {
        var sql = schema;

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}
