import React from 'react';
import { View, Text } from 'react-native';
import {DatabaseConnection} from '../../database/DatabaseConnection';


const SobreScreen = (props) => {

    // React.useEffect(async () => {
    //     const db = await DatabaseConnection.getConnection();
    //     db.transaction(tx => {
    //         tx.executeSql(
    //                 `CREATE TABLE IF NOT EXISTS projetos (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     nome TEXT,
    //     descricao TEXT,
    //     created_at TEXT,
    //     updated_at TEXT
    // );`,
    //             null,
    //             () => {console.log('ok')},
    //             (txObj, error) => { console.log('Error', error); }
    //         )
    //     });
    // }, []);

    return (
        <View style={{flex:1, backgroundColor: '#fafafa'}}>
            <View style={{ marginVertical: '2%', marginHorizontal: '3%' }}>
                <Text style={{ fontSize:20, fontWeight:'bold', marginBottom: '4%' }}>Sobre</Text>
                <Text style={{ marginTop: 1, fontSize:16, textAlign: 'justify' }}>
                    Este aplicativo foi desenvolvido como parte do Trabalho de Conclusão de Curso do Bacharelado em Ciência da Computação da UFRJ.
                </Text>
                <Text style={{ fontSize:16, textAlign: 'justify' }}>
                    Para mais informações sobre o trabalho e acesso ao texto, acesse [link da ufrj]
                </Text>
            </View>
        </View>
    );
}

export default SobreScreen;

