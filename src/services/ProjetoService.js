import { DatabaseConnection } from '../database/DatabaseConnection';


const table = "projetos"

export default class ProjetoService {

    static async addData(model) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table} (nome, descricao, created_at, updated_at) 
                    VALUES (?, ?, ?, ?);`, 
                    [model.nome, model.descricao, model.created_at, model.updated_at],
                    async (txObj, { insertId, rows }) => { resolve(insertId) },
                    (txObj, error) => console.log('Error', error)
                );
            })
        );
    }

    static async create(model) {
        // salvar no BD
        let now = (new Date).toISOString();
        let projetoId = await this.addData({
            ...model,
            created_at: now, 
            updated_at: now 
        });

        if(projetoId) {
            return projetoId;
        } else {
            return null;
        }
    }

    static async updateById(model) {
        // salvar no BD
        let now = (new Date).toISOString();
        let projetoId = await this.updateData({
            ...model,
            updated_at: now 
        });
    }

    static async updateData(model) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} set nome = ?, descricao = ?, updated_at = ?
                    WHERE id = ?;`, 
                    [model.nome, model.descricao, model.updated_at, model.id],
                    (txObj) => resolve(),
                    (txObj, error) => { console.log('Error', error); }
                )
            })
        );
    }

    static async deleteById(id) {
        // remover associações com coletas

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

    static async findByNome(nome) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE nome = ?;`,
                    [nome],
                    (txObj, { rows }) => {
                        if(rows._array.length) {
                            resolve(rows._array[0])
                        } else { resolve(null) }
                    }, 
                    (txObj, error) => console.log('Error ', error)
                );
            })
        );
    }

    static async findList() {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT id, nome FROM ${table} ORDER BY id ASC;`,
                    null,
                    (txObj, { rows }) => { resolve(rows._array) }, 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );
    }

    static async fetchMore(limit, offset=0) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT id, nome, descricao, updated_at 
                    FROM ${table} ORDER BY updated_at DESC
                    LIMIT ?, ? ;`,
                    [offset, limit],
                    (txObj, { rows }) => { resolve(rows._array) }, 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );   
    }

}