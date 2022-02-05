import { DatabaseConnection } from '../database/DatabaseConnection';

const table = "configuracoes";

export default class ConfiguracaoService {

	static async findAll() {
        const db = await DatabaseConnection.getConnection();
	    return new Promise(
	        (resolve, reject) => db.transaction(tx => {
	            tx.executeSql(
	                `SELECT * FROM ${table} ORDER BY id DESC;`,
	                null,
	                (txObj, { rows }) => resolve(rows._array), 
	                (txObj, error) => { console.log('Error ', error) }
	            );
	        })
	    );
	}

    static async updateByNome(nome, valor) {
        const db = await DatabaseConnection.getConnection();
        console.log('update ', nome)
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET valor = ? WHERE nome = ?;`,
                    [valor, nome],
                    () => {console.log('done ', nome); resolve(true)},
                    (txObj, error) => { console.log('Error', error); }
                )
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
                    (txObj, { rows }) => resolve(rows._array[0]), 
                    (txObj, error) => console.log('Error ', error)
                );
            })
        );
    }

    static async findNextNumeroColeta() {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT valor FROM ${table} WHERE nome = 'proximo_numero_coleta';`,
                    null,
                    (txObj, { rows }) => resolve(parseInt(rows._array[0].valor)), 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );
    }

    static async updateNextNumeroColeta(valor) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET valor = ? WHERE nome = 'proximo_numero_coleta';`,
                    [parseInt(valor)],
                    () => resolve(true), 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );
    }

    static async findNomeColetor() {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT valor FROM ${table} WHERE nome = 'nome_coletor';`,
                    null,
                    (txObj, { rows }) => resolve(rows._array[0].valor), 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );
    }

}