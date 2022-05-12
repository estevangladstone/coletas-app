import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


export const DatabaseConnection = {
    getConnection: () => {
        (async () => {
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            }
            await FileSystem.downloadAsync(
                Asset.fromModule(require("../assets/database/collectfy.db")).uri,
                FileSystem.documentDirectory + 'SQLite/collectfy.db'
            );
        })();
        return SQLite.openDatabase('collectfy.db');
    }
};