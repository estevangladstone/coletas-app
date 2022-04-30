import { DatabaseConnection } from './DatabaseConnection';
import { schema } from './schema';


export const DatabaseInit = async () => {

    var db = null
    db = await DatabaseConnection.getConnection();
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {
        console.log('Foreign keys turned on');
    });

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