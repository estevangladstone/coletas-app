// import { DatabaseConnection } from '../database/DatabaseConnection';


const table = "configuracoes";
const db = require('../database/DatabaseConnection');
const conn = db.getConnection();

export default class ConfiguracaoService {

	static async findAll() {
	    return new Promise(
	        (resolve, reject) => conn.transaction(tx => {
	            tx.executeSql(
	                `SELECT * FROM ${table} ORDER BY id DESC;`,
	                null,
	                (txObj, { rows }) => resolve(rows._array), 
	                (txObj, error) => {}
	            );
	        })
	    );
	}

    static async createOrUpdateByNome(nome, valor) {
        let exists = await this.findByNome(nome);
        if(exists) {
            await this.updateByNome(nome, valor);
        } else {
            await this.create(nome, valor);
        }
    }

    static async create(nome, valor) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table}(nome, valor) VALUES(?, ?);`,
                    [nome, valor],
                    () => { resolve(true) },
                    (txObj, error) => {}
                )
            })
        );
    }
    
    static async updateByNome(nome, valor) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET valor = ? WHERE nome = ?;`,
                    [valor, nome],
                    () => { resolve(true) },
                    (txObj, error) => {}
                )
            })
        );
    }

    static async findByNome(nome) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE nome = ?;`,
                    [nome],
                    (txObj, { rows }) => {
                        if(rows._array.length) {
                            resolve(rows._array[0])
                        } else { resolve(null) }
                    }, 
                    (txObj, error) => {}
                );
            })
        );
    }

    static async findNextNumeroColeta() {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT valor FROM ${table} WHERE nome = 'proximo_numero_coleta';`,
                    null,
                    (txObj, { rows }) => {
                        if(rows._array.length) {
                            resolve(rows._array[0].valor)
                        } else {
                            resolve(1)
                        }
                    }, 
                    (txObj, error) => {}
                );
            })
        );
    }

    static async updateNextNumeroColeta(valor) {
        let exists = await this.findByNome('proximo_numero_coleta');
        if(!exists) {
            await this.create('proximo_numero_coleta', valor);
        } else {
            return new Promise(
                (resolve, reject) => conn.transaction(tx => {
                    tx.executeSql(
                        `UPDATE ${table} SET valor = ? WHERE nome = 'proximo_numero_coleta';`,
                        [parseInt(valor)],
                        () => resolve(true), 
                        (txObj, error) => {}
                    );
                })
            );
        }
    }

    static async findNomeColetor() {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT valor FROM ${table} WHERE nome = 'nome_coletor';`,
                    null,
                    (txObj, { rows }) => {
                        if(rows._array.length) {
                            resolve(rows._array[0].valor)
                        } else {
                            resolve('')
                        }
                    }, 
                    (txObj, error) => {}
                );
            })
        );
    }

}