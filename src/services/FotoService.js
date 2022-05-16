// import { DatabaseConnection } from '../database/DatabaseConnection';

const table = "fotos";
const db = require('../database/DatabaseConnection');
const conn = db.getConnection();

export default class FotoService {

    static async create(uri, assetId, coletaId) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table}(uri, asset_id, coleta_id) VALUES(?, ?, ?);`,
                    [uri, assetId, coletaId],
                    () => { resolve(true) },
                    (txObj, error) => {}
                )
            })
        );
    }

    static async updateById(id, uri, assetId, coletaId) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET uri = ?, asset_id = ?, coleta_id = ? WHERE id = ?;`,
                    [uri, assetId, coletaId, id],
                    (txObj) => resolve(), 
                    (txObj, error) => {}
                );
            })
        );
    }

    static async findByColeta(coletaId) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE coleta_id = ?;`,
                    [coletaId],
                    (txObj, { rows }) => {
                        if(rows._array.length) {
                            resolve(rows._array)
                        } else { resolve(null) }
                    }, 
                    (txObj, error) => {}
                );
            })
        );
    }

    static async deleteByColeta(coletaId) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${table} WHERE coleta_id = ?;`, 
                    [coletaId], 
                    () => resolve(true),
                    (txObj, error) => {}    
                )
            })
        );
    }

    static async deleteByAsset(assetId) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${table} WHERE asset_id = ?;`, 
                    [assetId], 
                    () => resolve(true),
                    (txObj, error) => {}    
                )
            })
        );
    }

    static async findByAsset(assetId) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE asset_id = ?;`, 
                    [assetId], 
                    (txObj, { rows }) => { 
                        console.log('fotos = ', rows);
                        resolve(rows._array[0]);
                    },
                    (txObj, error) => {}    
                )
            })
        );
    }

}