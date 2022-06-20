// import { DatabaseConnection } from '../database/DatabaseConnection';
import FotoService from './FotoService';
import * as MediaLibrary from 'expo-media-library';


const table = "projetos"
const db = require('../database/DatabaseConnection');
const conn = db.getConnection();

export default class ProjetoService {

    static async addData(model) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table} (nome, descricao, created_at, updated_at) 
                    VALUES (?, ?, ?, ?);`, 
                    [model.nome, model.descricao, model.created_at, model.updated_at],
                    async (txObj, { insertId, rows }) => { resolve(insertId) },
                    (txObj, error) => {}
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

    static async update(model) {
        let now = (new Date).toISOString();
        let raw_projetos = await this.findById(model.id);
        let currProjeto = raw_projetos._array[0];

        let projetoId = await this.updateData({
            ...model,
            updated_at: now 
        });

        if(model.nome != currProjeto.nome) {
            await this.moveAlbum(currProjeto.nome, model.nome);
        }
    }

    static async moveAlbum(fromName, toName) {
        let oldAlbum = await MediaLibrary.getAlbumAsync(fromName);
        if(oldAlbum) {
            let oldAlbumPagedInfo = await MediaLibrary.getAssetsAsync({ album: oldAlbum });
            let newAlbum = await MediaLibrary.getAlbumAsync(toName);

            let hasAssets = oldAlbumPagedInfo.assets.length > 0 ? true : false;
            while(hasAssets) {
                for(let i=0; i<oldAlbumPagedInfo.assets.length; i++) {
                    let oldFoto = await FotoService.findByAsset(oldAlbumPagedInfo.assets[i].id);
                    
                    if(oldFoto) {
                        if(!newAlbum) {
                            newAlbum = await MediaLibrary.createAlbumAsync('Coletas+/'+toName, oldAlbumPagedInfo.assets[i], false);
                        } else {
                            await MediaLibrary.addAssetsToAlbumAsync([oldAlbumPagedInfo.assets[i]], newAlbum, false);
                        }

                        let albumPagedInfo = await MediaLibrary.getAssetsAsync({
                            album: newAlbum, sortBy: [[MediaLibrary.SortBy.modificationTime, false]]
                        });
                        let movedAsset = albumPagedInfo.assets[0];

                        await FotoService.updateById(
                            oldFoto.id, movedAsset.uri, movedAsset.id, oldFoto.coleta_id);
                    }
                }

                if(oldAlbumPagedInfo.hasNextPage) {
                    oldAlbumPagedInfo = await MediaLibrary.getAssetsAsync({ album: oldAlbum });
                    hasAssets = true;
                } else {
                    hasAssets = false;
                }
            }

            await MediaLibrary.deleteAlbumsAsync([oldAlbum.id]);
        }
    }

    static async updateData(model) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} set nome = ?, descricao = ?, updated_at = ?
                    WHERE id = ?;`, 
                    [model.nome, model.descricao, model.updated_at, model.id],
                    (txObj) => resolve(),
                    (txObj, error) => {}
                )
            })
        );
    }

    static async delete(id) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `UPDATE coletas SET projeto_id = NULL WHERE projeto_id = ?`,
                    [id]
                );
                
                tx.executeSql(
                    `DELETE FROM ${table} WHERE id = ?;`, 
                    [id], 
                    () => resolve(true),
                    (txObj, error) => {}    
                )
            })
        );
    }

    static async deleteById(id) {
        let raw_projetos = await this.findById(id);
        let currProjeto = raw_projetos._array[0];

        await this.moveAlbum(currProjeto.nome, 'Sem projeto');

        return await this.delete(id);
    }

    static async findById(id) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${table} WHERE id = ?;`,
                    [id],
                    (txObj, { rows }) => resolve(rows), 
                    (txObj, error) => {}
                );
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

    static async findList() {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT id, nome FROM ${table} ORDER BY id ASC;`,
                    null,
                    (txObj, { rows }) => { resolve(rows._array) }, 
                    (txObj, error) => {}
                );
            })
        );
    }

    static async fetchMore(limit, offset=0) {
        return new Promise(
            (resolve, reject) => conn.transaction(tx => {
                tx.executeSql(
                    `SELECT p.id, p.nome, p.descricao, p.updated_at, COUNT(c.id) as qtd_coletas 
                    FROM ${table} p
                    LEFT JOIN coletas c ON p.id = c.projeto_id 
                    GROUP BY p.id
                    ORDER BY p.updated_at DESC
                    LIMIT ?, ? ;`,
                    [offset, limit],
                    (txObj, { rows }) => { resolve(rows._array) }, 
                    (txObj, error) => {}
                );
            })
        );   
    }

}