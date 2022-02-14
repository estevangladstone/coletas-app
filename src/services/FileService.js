import * as FileSystem from 'expo-file-system';


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
				to: FileSystem.cacheDirectory+'temp/'+time+'.jpeg' 
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

}