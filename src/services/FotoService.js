import { DatabaseConnection } from '../database/DatabaseConnection';

const table = "fotos";

export default class FotoService {

    static async create(uri, assetId, coletaId) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table}(uri, asset_id, coleta_id) VALUES(?, ?, ?);`,
                    [uri, assetId, coletaId],
                    () => { resolve(true) },
                    (txObj, error) => { console.log('Error', error); }
                )
            })
        );
    }

    static async findByColeta(coletaId) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE coleta_id = ?;`,
                    [coletaId],
                    (txObj, { rows }) => {
                        if(rows._array.length) {
                            resolve(rows._array)
                        } else { resolve(null) }
                    }, 
                    (txObj, error) => console.log('Error ', error)
                );
            })
        );
    }

    static async deleteByColeta(coletaId) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${table} WHERE coleta_id = ?;`, 
                    [coletaId], 
                    () => resolve(true),
                    (txObj, error) => console.log('Error', error)    
                )
            })
        );
    }

    static async deleteByAsset(assetId) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${table} WHERE asset_id = ?;`, 
                    [assetId], 
                    () => resolve(true),
                    (txObj, error) => console.log('Error', error)    
                )
            })
        );
    }
    
}