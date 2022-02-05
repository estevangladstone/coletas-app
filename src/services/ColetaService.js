import { DatabaseConnection } from '../database/DatabaseConnection';
import FileService from './FileService';
import ConfiguracaoService from './ConfiguracaoService';


const table = "coletas"

export default class ColetaService {

    static async create(model) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table} (data_hora, coletores, numero_coleta, especie,
                    familia, habito_crescimento, descricao_especime, substrato,
                    descricao_local, latitude, longitude, altitude, pais, estado, localidade,
                    observacoes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
                    [model.data_hora, model.coletores, model.numero_coleta, model.especie,
                    model.familia, model.habito_crescimento, model.descricao_especime, 
                    model.substrato, model.descricao_local, model.latitude, model.longitude,
                    model.altitude, model.pais, model.estado, model.localidade, 
                    model.observacoes],
                    async (txObj, { insertId, rows }) => {
                        if(model.numero_coleta) {
                            await ConfiguracaoService
                                .updateNextNumeroColeta(parseInt(model.numero_coleta+1));
                        }
                        resolve(insertId)
                    },
                    (txObj, error) => console.log('Error', error)
                );
            })
        );
    }

    static async deleteById(id) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${table} WHERE id = ?;`, 
                    [id], 
                    () => resolve(true),
                    (txObj, error) => console.log('Error', error)    
                )
            })
        );
    }

    // TODO: Permitir alterar por valores escolhidos
    static async updateById(model) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET data_hora = ?, coletores = ?, numero_coleta = ?,
                    especie = ?, familia = ?, habito_crescimento = ?, descricao_especime = ?,
                    substrato = ?, descricao_local = ?, latitude = ?, longitude = ?,
                    altitude = ?, pais = ?, estado = ?, localidade = ?, observacoes = ?
                    WHERE id = ?;`,
                    [model.data_hora, model.coletores, model.numero_coleta, model.especie,
                    model.familia, model.habito_crescimento, model.descricao_especime, 
                    model.substrato, model.descricao_local, model.latitude, model.longitude,
                    model.altitude, model.pais, model.estado, model.localidade, 
                    model.observacoes, model.id],
                    (txObj) => resolve(),
                    (txObj, error) => { console.log('Error', error); }
                )
            })
        );
    }

    static async updateThumbnailById(thumbnail, id) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET thumbnail = ? WHERE id = ?;`,
                    [thumbnail, id],
                    null,
                    (txObj, error) => { console.log('Error', error); }
                )
            })
        );
    }

    static async findById(id) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE id = ?;`,
                    [id],
                    (txObj, { rows }) => resolve(rows), 
                    (txObj, error) => console.log('Error ', error)
                );
            })
        );
    }

    static async findByNumeroColeta(numero_coleta) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE numero_coleta = ?;`,
                    [numero_coleta],
                    (txObj, { rows }) => resolve(rows), 
                    (txObj, error) => console.log('Error ', error)
                );
            })
        );
    }

    static async findAll() {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} ORDER BY id DESC;`,
                    null,
                    (txObj, { rows }) => { resolve(rows._array) }, 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );
    }

    static async getPhotosListById(id) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            async (resolve, reject) => {
                const files = await FileService.listDir('registro_'+id);
                if(files && files.length > 0) {
                    const filesFullNames = files.map((fileName) => {
                        return FileService.getFileUri('registro_'+id+'/'+fileName);
                    });
                    resolve(filesFullNames);
                }
                resolve([]);
            }
        );
    }

    static async getMaxNumeroColeta() {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT MAX(numero_coleta) AS num FROM ${table};`,
                    null,
                    (txObj, { rows }) => {
                        if(rows.length > 0) {
                            resolve(parseInt(rows._array[0].num));
                        } else {
                            resolve(0); // se não há coleta, retornar 0 
                        }
                    }, 
                    (txObj, error) => console.log('Error ', error)
                );
            })
        );
    }

}