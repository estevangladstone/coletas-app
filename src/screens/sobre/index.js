import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { ScrollView, Link, Center, Heading, Text } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DatabaseConnection } from '../../database/DatabaseConnection';
import { DatabaseInit } from '../../database/DatabaseInit';


const SobreScreen = (props) => {

    const [valor, setValor] = useState(null);

    React.useEffect(async () => {
        // const db = await DatabaseConnection.getConnection();
        // db.transaction(tx => {
        //     tx.executeSql(
        //             `select * from fotos;`,
        //         null,
        //         (txObj, {rows}) => {console.log('ok');console.log(rows)},
        //         (txObj, error) => { console.log('Error', error); }
        //     )
        // });

        // await DatabaseInit();
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView px={3} bg="#fafafa">
                <Center m={2}>                
                    <Heading mb={2}>Coletas-App</Heading> 

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
                    <Text bold>Coletas-App</Text> é um aplicativo Android para anotações de coletas botânicas em campo.   
                </Text>
                <Text fontSize="md" style={{ textAlign: 'justify' }}>
                    Este aplicativo foi desenvolvido como parte do Trabalho de Conclusão de Curso do Bacharelado em Ciência da Computação da UFRJ.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SobreScreen;

