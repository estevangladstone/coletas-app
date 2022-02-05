import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { ScrollView, VStack, Button, Divider, Heading, Text } from 'native-base';
import FileService from '../../services/FileService';
import ColetaService from '../../services/ColetaService';
import { jsonToCSV } from 'react-native-csv';
import * as Sharing from 'expo-sharing';


const DadosScreen = (props) => {

    const [isLoadingDatabase, setIsLoadingDatabase] = useState(false);
    // const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

    const exportDatabase = async () => {
        setIsLoadingDatabase(true);

        let coletas = await ColetaService.findAll()
            .catch(error => {
                Alert.alert(
                    "Erro",
                    "Ocorreu um erro ao tentar obter os registros de Coleta do banco de dados.",
                    [{ text: "OK", style: "default" }],
                    { cancelable: true }
                );
            });
        let coletasCSV = jsonToCSV(coletas);
        let fileUri = await FileService.createCacheFile('database_export.csv', coletasCSV);

        let canShare = await Sharing.isAvailableAsync()
            .catch((error) => {
                Alert.alert(
                    "Erro",
                    "Não foi possível obter permissões para realizar o compartilhamento do arquivo.",
                    [{ text: "OK", style: "default" }],
                    { cancelable: true }
                );
            });

        if(canShare) {
            Sharing.shareAsync(fileUri)
                .catch((error) =>  
                    Alert.alert(
                        "Erro",
                        "Algum erro ocorreu e não foi possível realizar o compartilhamento.",
                        [{ text: "OK", style: "default" }],
                        { cancelable: true }
                    ));
        } else {
            Alert.alert(
                "Erro",
                "Algum erro ocorreu e não foi possível realizar o compartilhamento.",
                [{ text: "OK", style: "default" }],
                { cancelable: true }
            )
        }
        setIsLoadingDatabase(false);
    }

    return (
        <ScrollView flex={1} bg="#fff">
            <VStack mx="3" my="2">
                <Heading size="md" mb="1">Exportar Banco de Dados</Heading>
                <Text my="1">
                    Exportar as anotações de coletas presentes no Banco de Dados do aplicativo em formato CSV.
                </Text>
                <Button 
                    isLoading={isLoadingDatabase} size="lg" my="1" colorScheme="green"
                    _loading={{
                        bg: "green",
                        _text: { color: "white" }
                    }}
                    _spinner={{ color: "white" }}
                    isLoadingText="Gerando arquvio"
                    onPress={() => exportDatabase()}>
                    Gerar arquivo CSV
                </Button>
            </VStack>
        </ScrollView>
    );
}

export default DadosScreen;