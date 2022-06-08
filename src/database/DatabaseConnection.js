import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


class Database {
    getConnection() {
        return SQLite.openDatabase('coletasMais.db');
    }
};

module.exports = new Database();