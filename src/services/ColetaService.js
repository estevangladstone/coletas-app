import { DatabaseConnection } from '../database/DatabaseConnection';
import FileService from './FileService';
import ConfiguracaoService from './ConfiguracaoService';
import ProjetoService from './ProjetoService';
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
                    localidade, observacoes, projeto_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
                    [model.data_hora, model.coletor_principal, model.outros_coletores,
                    model.numero_coleta, model.especie, model.familia, 
                    model.habito_crescimento, model.descricao_especime, model.substrato,
                    model.descricao_local, model.latitude, model.longitude, model.altitude,
                    model.pais, model.estado, model.localidade, model.observacoes,
                    model.projeto_id],
                    async (txObj, { insertId, rows }) => { resolve(insertId) },
                    (txObj, error) => console.log('Error', error)
                );
            })
        );
    }

    static async create(model, photos, projetoName=null) {
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
            // incluir projeto na coleta
            if(projetoName) { // se não é nulo
                // encontrar projeto
                let projeto = await ProjetoService.findByNome(projetoName);
                let projetoId = null;
                if(projeto) {
                    projetoId = projeto.id;
                } else {
                    // se não existe, criar novo
                    projetoId = await ProjetoService.create({ nome: projetoName });
                }
                // associar à coleta
                await ColetaService.updateProjetoById(projetoId, coletaId);
            }

            if(photos.length) {
                let newPhotos = await FileService.renamePhotos(model.coletor_principal, parsed_nc, 1);

                let album = await MediaLibrary.getAlbumAsync(projetoName ? projetoName : 'Sem projeto');
                for(let i=0; i<newPhotos.length; i++) {
                    let asset = await MediaLibrary.createAssetAsync(newPhotos[i]);
                    // obtem timestamp de criação do asset, para referencia
                    let creationTimestamp = asset.creationTime - 1;
                    if(!album) {
                        // cria o album já movendo o asset para ele
                        album = await MediaLibrary.createAlbumAsync('fotos_coletas'+ (projetoName ? '/'+projetoName : '/Sem projeto'), asset, false);
                    } else {
                        // move o asset para o album
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }

                    // obtem a lista de assets do album criados após a timestamp de referencia
                    let albumPagedInfo = await MediaLibrary.getAssetsAsync({album: album, createdAfter: creationTimestamp});
                    // obtem asset criado mais recentemente
                    let movedAsset = albumPagedInfo.assets[albumPagedInfo.assets.length - 1];
                    // cria o registro de foto no banco de dados
                    await FotoService.create(movedAsset.uri, movedAsset.id, coletaId);
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

    static async updateById(model, photos, projetoName=null) {
        // transformar nos formatos necessários para o BD
        let parsed_nc = model.numero_coleta ? parseInt(model.numero_coleta) : null;
        let parsed_dh = model.data_hora.toISOString();

        // salvar no BD
        await this.updateData({
            ...model,
            numero_coleta: parsed_nc,
            data_hora: parsed_dh,
        });

        // obter projeto atual
        let currProjeto = model.projeto_id ? await ProjetoService.findById(model.projeto_id) : null; 

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
            let album = await MediaLibrary.getAlbumAsync(currProjeto?._array[0] ? currProjeto._array[0].nome : 'Sem projeto');
            for(let i=0; i<newPhotos.length; i++) {
                let asset = await MediaLibrary.createAssetAsync(newPhotos[i]);
                let creationTimestamp = asset.creationTime - 1;
                
                if(!album) {
                    // cria o album já movendo o asset para ele
                    album = await MediaLibrary.createAlbumAsync('fotos_coletas'+ (currProjeto?._array[0] ? '/'+currProjeto._array[0].nome : '/Sem projeto'), asset, false);
                } else {
                    // move o asset para o album
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                }
                
                let albumPagedInfo = await MediaLibrary.getAssetsAsync({album: album, createdAfter: creationTimestamp});
                let movedAsset = albumPagedInfo.assets[albumPagedInfo.assets.length - 1];
                await FotoService.create(movedAsset.uri, movedAsset.id, model.id);
            }
        }

        // remove o diretório temp/
        await FileService.deleteTempFile();

        // comparar projeto.nome com projetoName
        if(currProjeto?._array[0]?.nome != projetoName) {
            // buscar o novo projeto ou criar
            if(projetoName) {
                let projeto = await ProjetoService.findByNome(projetoName);
                let projetoId = null;

                if(projeto) {
                    projetoId = projeto.id;
                } else {
                    // se não existe, criar novo
                    projetoId = await ProjetoService.create({ nome: projetoName });
                }
                // associar à coleta
                await ColetaService.updateProjetoById(projetoId, model.id);
            } else {
                await ColetaService.updateProjetoById(null, model.id);
            }

            // obter fotos associadas ao projeto
            let photosToMove = await this.getPhotosListById(model.id);
            let album = await MediaLibrary.getAlbumAsync(projetoName);    
            // para cada foto, mover para a nova pasta
            for(let i=0; i<photosToMove.length; i++) {
                let assetToMove = await MediaLibrary.getAssetInfoAsync(photosToMove[i].asset_id);
                let creationTimestamp = assetToMove.creationTime - 1;

                if(!album) {
                    album = await MediaLibrary.createAlbumAsync('fotos_coletas'+ (projetoName ? '/'+projetoName : '/Sem projeto'), assetToMove, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([assetToMove], album, false);
                }

                // obtem a lista de assets do album criados após a timestamp de referencia
                let albumPagedInfo = await MediaLibrary.getAssetsAsync(
                    {album: album, createdAfter: creationTimestamp});
                // obtem asset criado mais recentemente
                let movedAsset = albumPagedInfo.assets[albumPagedInfo.assets.length - 1];
                // cria o registro de foto no banco de dados
                await FotoService.updateById(
                    photosToMove[i].id, movedAsset.uri, movedAsset.id, model.id);
            }
        }

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
                    pais = ?, estado = ?, localidade = ?, observacoes = ?, projeto_id = ?
                    WHERE id = ?;`,
                    [model.data_hora, model.coletor_principal, model.outros_coletores, model.numero_coleta, model.especie,
                    model.familia, model.habito_crescimento, model.descricao_especime, 
                    model.substrato, model.descricao_local, model.latitude, model.longitude,
                    model.altitude, model.pais, model.estado, model.localidade, 
                    model.observacoes, model.projeto_id, model.id],
                    (txObj) => resolve(),
                    (txObj, error) => { console.log('Error', error); }
                )
            })
        );
    }

    static async updateProjetoById(projeto_id, id) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `UPDATE ${table} SET projeto_id = ? WHERE id = ?;`,
                    [projeto_id, id],
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
                    `SELECT c.id, c.data_hora, c.numero_coleta, c.especie, c.localidade,
                    f.uri as thumbnail
                    FROM ${table} c
                    LEFT JOIN fotos f ON f.id = (
                        SELECT ft.id
                        FROM fotos ft
                        WHERE ft.coleta_id = c.id
                        LIMIT 1
                    )  
                    ORDER BY c.id DESC
                    LIMIT ? OFFSET ? ;`,
                    [limit, offset],
                    (txObj, { rows }) => resolve(rows._array), 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );   
    }

    static async fetchMoreByProjeto(projeto_id, limit, offset=0) {
        const db = await DatabaseConnection.getConnection();
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT c.id, c.data_hora, c.numero_coleta, c.especie, c.localidade,
                    f.uri as thumbnail
                    FROM ${table} c
                    LEFT JOIN fotos f ON f.id = (
                        SELECT ft.id
                        FROM fotos ft
                        WHERE ft.coleta_id = c.id
                        LIMIT 1
                    )
                    WHERE projeto_id = ?
                    ORDER BY c.id DESC
                    LIMIT ? OFFSET ? ;`,
                    [projeto_id, limit, offset],
                    (txObj, { rows }) => resolve(rows._array), 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );   
    }

    static async getPhotosListById(id) {
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

    static async findByProjetoId(projeto_id) {
        const db = await DatabaseConnection.getConnection();
        let query = ''; 
        let args = []; 
        if(projeto_id) {
            query = `SELECT * FROM ${table} WHERE projeto_id = ? ORDER BY id DESC;`;
            args = [projeto_id];
        } else {
            query = `SELECT * FROM ${table} WHERE projeto_id IS NULL ORDER BY id DESC;`;
        }
        return new Promise(
            (resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    query,
                    args,
                    (txObj, { rows }) => { resolve(rows._array) }, 
                    (txObj, error) => { console.log('Error ', error) }
                );
            })
        );
    }

}