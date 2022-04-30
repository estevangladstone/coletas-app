import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
// import { DatabaseConnection } from '../../database/DatabaseConnection';
import { DatabaseInit } from '../../database/DatabaseInit';


const SobreScreen = (props) => {

    const [valor, setValor] = useState(null);

    React.useEffect(async () => {
        // const db = await DatabaseConnection.getConnection();
        // db.transaction(tx => {
        //     tx.executeSql(
        //             `select thumbnail from coletas;`,
        //         null,
        //         (txObj, {rows}) => {console.log('ok');console.log(rows)},
        //         (txObj, error) => { console.log('Error', error); }
        //     )
        // });

        await DatabaseInit();
    }, []);

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

