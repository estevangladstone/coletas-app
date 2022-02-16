import { DatabaseConnection } from '../database/DatabaseConnection';
import FileService from './FileService';
import ConfiguracaoService from './ConfiguracaoService';
import FotoService from './FotoService';
import * as MediaLibrary from 'expo-media-library';


const table = "coletas"

export default class ColetaService {

    static async addData(model) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO ${table} (data_hora, coletor_principal, outros_coletores,
                    numero_coleta, especie, familia, habito_crescimento, descricao_especime,
                    substrato, descricao_local, latitude, longitude, altitude, pais, estado,
                    localidade, observacoes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
                    [model.data_hora, model.coletor_principal, model.outros_coletores,
                    model.numero_coleta, model.especie, model.familia, 
                    model.habito_crescimento, model.descricao_especime, model.substrato,
                    model.descricao_local, model.latitude, model.longitude, model.altitude,
                    model.pais, model.estado, model.localidade, model.observacoes],
                    async (txObj, { insertId, rows }) => { resolve(insertId) },
                    (txObj, error) => console.log('Error', error)
                );
            })
        );
    }

    static async create(model, photos) {
        // transformar nos formatos necessários para o BD
        let parsed_nc = model.numero_coleta ? parseInt(model.numero_coleta) : null;
        let parsed_dh = model.data_hora.toISOString();

        // salvar no BD
        let coletaId = await this.addData({
            ...model,
            numero_coleta: parsed_nc,
            data_hora: parsed_dh,
        });

        if(coletaId) {
            if(photos.length) {
                let newPhotos = await FileService.renamePhotos(model.coletor_principal, parsed_nc, 1);

                let album = await MediaLibrary.getAlbumAsync('fotos_coletas');
                for(let i=0; i<newPhotos.length; i++) {
                    let asset = await MediaLibrary.createAssetAsync(newPhotos[i]);
                    if(!album) {
                        album = await MediaLibrary.createAlbumAsync('fotos_coletas', asset);
                    } else {
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album);
                    }
                    let movedAsset = await MediaLibrary.getAssetInfoAsync(asset);
                    await FotoService.create(movedAsset.uri, movedAsset.id, coletaId);
                    if(i == 0) {
                        await this.updateThumbnailById(movedAsset.uri, coletaId);    
                    }
                }
            }
            
            // remove o diretório temp/
            await FileService.deleteTempFile();

            // atualizar numero de coleta
            let nextNC = await ConfiguracaoService.findNextNumeroColeta();
            if(parsed_nc >= parseInt(nextNC)) {
                await ConfiguracaoService
                    .updateNextNumeroColeta(parseInt(parsed_nc+1));
            }
            return coletaId;
        } else {
            return null;
        }
    }

    static async updateById(model, photos) {
        // transformar nos formatos necessários para o BD
        let parsed_nc = model.numero_coleta ? parseInt(model.numero_coleta) : null;
        let parsed_dh = model.data_hora.toISOString();

        // salvar no BD
        await this.updateData({
            ...model,
            numero_coleta: parsed_nc,
            data_hora: parsed_dh,
        });

        if(photos.length) {
            let currentPhotos = await this.getPhotosListById(model.id);

            let toRemove = currentPhotos.filter(
                (item) => { return !photos.includes(item.uri); }
            );
            let assetsIdRemove = toRemove.map((item) => item.asset_id);
            await MediaLibrary.deleteAssetsAsync(assetsIdRemove);
            toRemove.forEach(async (item) => { 
                await FotoService.deleteByAsset(item.asset_id);
            });
            
            let newPhotos = await FileService.renamePhotos(model.coletor_principal, parsed_nc, currentPhotos.length+1);

            let album = null;
            for(let i=0; i<newPhotos.length; i++) {
                let asset = await MediaLibrary.createAssetAsync(newPhotos[i]);
                album = album ?? await MediaLibrary.getAlbumAsync('fotos_coletas');
                await MediaLibrary.addAssetsToAlbumAsync([asset], album);
                let movedAsset = await MediaLibrary.getAssetInfoAsync(asset);
                await FotoService.create(movedAsset.uri, movedAsset.id, model.id);
                if(i == 0) {
                    await this.updateThumbnailById(movedAsset.uri, model.id);    
                }
            }
        }
        
        // remove o diretório temp/
        await FileService.deleteTempFile();

        // atualizar numero de coleta
        let nextNC = await ConfiguracaoService.findNextNumeroColeta();
        if(parsed_nc >= parseInt(nextNC)) {
            await ConfiguracaoService
                .updateNextNumeroColeta(parseInt(parsed_nc+1));
        }
    }

    static async deleteById(id) {
        let photos = await this.getPhotosListById(id);
        if(photos) {
            let assetIds = photos.map((photo) => {
                return photo.asset_id;
            });
            await MediaLibrary.deleteAssetsAsync(assetIds);
            await FotoService.deleteByColeta(id);
        }

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
    static async updateData(model) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET data_hora = ?, coletor_principal = ?,
                    outros_coletores = ?, numero_coleta = ?, especie = ?, familia = ?,
                    habito_crescimento = ?, descricao_especime = ?, substrato = ?,
                    descricao_local = ?, latitude = ?, longitude = ?, altitude = ?,
                    pais = ?, estado = ?, localidade = ?, observacoes = ?
                    WHERE id = ?;`,
                    [model.data_hora, model.coletor_principal, model.outros_coletores, model.numero_coleta, model.especie,
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
                    () => resolve(true),
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

    static async fetchMore(limit, offset=0) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT id, data_hora, numero_coleta, especie, localidade, thumbnail 
                    FROM ${table} ORDER BY id DESC
                    LIMIT ?, ? ;`,
                    [offset, limit],
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
                const photos = await FotoService.findByColeta(id);
                if(photos && photos.length > 0) {
                    resolve(photos);
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
                            resolve(rows._array[0].num);
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