import * as FileSystem from 'expo-file-system';
import { generateImageName } from '../helpers';


const coletasDir = FileSystem.documentDirectory+'fotos_coletas/';

export default class FileService {

	static async listDir(dirName) {
		try {
			dir = await this.exists(dirName);
			
			if(dirName && dir) {
				return await FileSystem.readDirectoryAsync(coletasDir+dirName+'/');
			} 
		} catch(e) {
			console.log('{listDir} : ', e);
		}
		return false;
	}

	static async exists(pathToFile, raw=false) {
		try {
			let path = raw ? pathToFile : coletasDir+pathToFile;

			const pathInfo = await FileSystem.getInfoAsync(path);
			return pathInfo.exists;
		} catch(e) {
			console.log('{exists} : ', e);
		}
	}

	static async createDir(dirName) {
		try {
			const dirToBe = await this.exists(dirName);

			if(!dirToBe) {
				await FileSystem.makeDirectoryAsync(
					coletasDir+dirName+'/', 
					{ intermediates:true }
				);
			}
			return true;
		} catch(e) {
			console.log('{createDir} : ', e);
		}
		return false;
	}

	static async moveFile(fileFrom, fileTo) {
		try {
			if(await this.exists(fileFrom, true)) {
				await FileSystem.moveAsync({
					from: fileFrom,
					to: coletasDir+fileTo
				});
				return true;
			}
		} catch(e) {
			console.log('{moveFile} : ', e);
		}
		return false;
	}

	static getFileUri(filePath) {
		try {
			return coletasDir+filePath;
		} catch(e) {
			console.log('{getFile} : ', e);
		}
	}

	static async deleteFile(filePath=null, raw=false) {
		try {
			if(filePath) {
				raw ?
					await FileSystem.deleteAsync(filePath, { idempotent:true })
					: await FileSystem.deleteAsync(coletasDir+filePath, { idempotent:true });

				return true;
			}
		} catch(e) {
			console.log('{getFile} : ', e);
		}
		return false;
	}

	static async saveBatch(filesList, dirTo, coletor, numero='SN') {
		try {
			const created = await this.createDir(dirTo);
			
			if(created) {
				filesList.forEach(async (item, index) => {
					await this.moveFile(
						item, 
						dirTo+'/'+generateImageName(coletor, numero)
					);
				});
				
				return await this.listDir(dirTo);
			}
		} catch(e) {
			console.log('{getFile} : ', e);
		}
		return false;
	}

	static async createCacheFile(fileName, contents) {
        let fileUri = FileSystem.cacheDirectory+fileName;
        await FileSystem.writeAsStringAsync(
        	fileUri, contents, { encoding: FileSystem.EncodingType.UTF8 }
    	);
    	console.log(await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory));
    	return FileSystem.cacheDirectory+fileName;
	}

	static getPhotosDir() {
		return coletasDir;
	}

	static getExportDir() {
		return FileSystem.cacheDirectory;
	}

	static async saveCacheFile(fileFrom, fileTo) {
		await this.moveFile(fileFrom, fileTo);
		return await FileSystem.getInfoAsync(fileTo);
	}

}