import { schema } from './schema';


export const DatabaseInit = () => {

    let db = require('../database/DatabaseConnection');
    let conn = db.getConnection();
    
    conn.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {});

    let sql = schema;

    conn.transaction(
        tx => {
            for (var i = 0; i < sql.length; i++) {
                tx.executeSql(sql[i]);
            }
        }, 
        () => {},
        () => {}
    );

}