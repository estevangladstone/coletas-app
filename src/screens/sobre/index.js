import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, View, Image } from 'react-native';
import { ScrollView, Link, Center, Heading, Text } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DatabaseConnection } from '../../database/DatabaseConnection';
// import { DatabaseInit } from '../../database/DatabaseInit';
// import * as MediaLibrary from 'expo-media-library';
// import * as FileSystem from 'expo-file-system';


const SobreScreen = (props) => {

    const [valor, setValor] = useState(null);
    const [t1, set1] = useState(null);
    const [t11, set11] = useState(null);
    const [t2, set2] = useState(null);
    const [t22, set22] = useState(null);
    const [t3, set3] = useState(null);
    const [t33, set33] = useState(null);
    const [e, sete] = useState('a');

    React.useEffect(() => {
        async function prepare(){
            // let t = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory+'/SQLite')
            // console.log('t = ', t);
            const db = await DatabaseConnection.getConnection();
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM coletas;`,
                    null,
                    (txObj, {rows}) => { 
                        set1('1.resp int = '+JSON.stringify(rows))
                    },
                    (txObj, error) => {
                        set1('1.error int = '+JSON.stringify(error))
                    }
                )
            }, (error) => {
                set11('11.error ext = '+JSON.stringify(error))
            }, () => {
                set11('11.resp ext = OK')
            });

            db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO configuracoes(nome, valor) VALUES("teste", "agora");`,
                    null,
                    (txObj, {rows}) => {
                        set2('2.resp int = '+JSON.stringify(rows))
                    },
                    (txObj, error) => { 
                        set2('2.error int = '+JSON.stringify(error))
                    }
                )
            }, (error) => {
                set22('22.error ext = '+JSON.stringify(error))
            }, () => {
                set22('22.resp ext = OK')
            });
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM configuracoes;`,
                    null,
                    (txObj, {rows}) => { 
                        set3('3.resp int = '+JSON.stringify(rows))
                    },
                    (txObj, error) => { 
                        set3('3.error int = '+JSON.stringify(error))
                    }
                )
            }, (error) => {
                set33('33.error ext = '+JSON.stringify(error))
            }, () => {
                set33('33.resp ext = OK')
            });

            // {"line":1454,"column":1548,"sourceURL":"index.android.bundle"}
            // {"_array":[],"length":0}
            // await DatabaseInit();
        }

        prepare();
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView px={3} bg="#fafafa">
                <Center m={2}>                
                    <Heading mb={2}>Collectfy</Heading> 

                    <View style={{
                        borderRadius: 95,
                        borderColor: '#404040',
                        borderWidth: 5,
                        padding: 15
                    }}>
                        <Image 
                            alt="app logo"
                            style={{ 
                                width: 150,
                                height: 150,
                            }}
                            source={require('../../assets/imgs/app_icon.png')}
                        />
                    </View>
                </Center>

                <Text fontSize="md" style={{ textAlign: 'justify' }} mb={2}>
                    <Text bold italic>Collectfy</Text> é um aplicativo móvel para anotações de coletas botânicas em campo.   
                </Text>
                <Text fontSize="md" style={{ textAlign: 'justify' }}>
                    Este aplicativo foi desenvolvido como parte do Trabalho de Conclusão de Curso do Bacharelado em Ciência da Computação da UFRJ.
                </Text>

                <Text>1 {t1}</Text>
                <Text>11 {t11}</Text>
                <Text>2 {t2}</Text>
                <Text>22 {t22}</Text>
                <Text>3 {t3}</Text>
                <Text>33 {t33}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SobreScreen;

