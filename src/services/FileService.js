import * as FileSystem from 'expo-file-system';
import { generatePhotoName } from '../helpers';


export default class FileService {

	static async createCacheFile(fileName, contents) {
        let fileUri = FileSystem.documentDirectory+fileName;
        await FileSystem.writeAsStringAsync(
        	fileUri, contents, { encoding: FileSystem.EncodingType.UTF8 }
    	);
    	return FileSystem.documentDirectory+fileName;
	}

	static async saveInTemp(fileUri) {
		// ensures temp directory exists in cacheDirectory
		if(!(await FileSystem.getInfoAsync(FileSystem.cacheDirectory+'temp')).exists) {
		    await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory+'temp');
		}

		if((await FileSystem.getInfoAsync(fileUri)).exists) {
			let time = (new Date).getTime().toString();
			await FileSystem.moveAsync({
				from: fileUri,
				to: FileSystem.cacheDirectory+'temp/'+time+'.jpg' 
			});
			return true;
		} else {
			return false;
		}
	}

	static async getTempContents() {
		if(!(await FileSystem.getInfoAsync(FileSystem.cacheDirectory+'temp')).exists) {
		    return [];
		}

		let list = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory+'temp');
		return list.map(itemUri => {
			return FileSystem.cacheDirectory+'temp/'+itemUri;
		});
	}

	static async deleteTempFile(fileName=null) {
		if(fileName) {
			if(!(await FileSystem.getInfoAsync(FileSystem.cacheDirectory+'temp')).exists) {
			    return;
			}
			let tempFiles = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory+'temp');
			let nameParts = fileName.split('/');
			if(nameParts.length > 0 && tempFiles.includes(nameParts[nameParts.length-1])) {
				await FileSystem.deleteAsync(fileName, { idempotent:true });
			}
		} else {
			await FileSystem.deleteAsync(FileSystem.cacheDirectory+'temp', { idempotent:true });
		}
	}

	static async renamePhotos(coletor, numero, startIndex) {
		if(!(await FileSystem.getInfoAsync(FileSystem.cacheDirectory+'temp')).exists) {
		    return [];
		}

		let list = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory+'temp');
		list.forEach(async (itemUri,index) => {
			let fileName = generatePhotoName(coletor, numero, startIndex+index);
			FileSystem.moveAsync({
				from: FileSystem.cacheDirectory+'temp/'+itemUri,
				to: FileSystem.cacheDirectory+'temp/'+fileName
			});
		});
		let list2 = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory+'temp');
		return list2.map(item => {
			return FileSystem.cacheDirectory+'temp/'+item;
		});
	}

}