import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { ScrollView, VStack, Button, Divider, Heading, Text } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import FileService from '../../services/FileService';
import ColetaService from '../../services/ColetaService';
import ProjetoService from '../../services/ProjetoService';
import { jsonToCSV } from 'react-native-csv';
import * as Sharing from 'expo-sharing';
import { formatColetaData } from '../../helpers';


const DadosScreen = (props) => {

    const [isLoadingDatabase, setIsLoadingDatabase] = useState(false);
    const [projetos, setProjetos] = useState([]);
    const [option, setOption] = useState(-1);

    useEffect(() => {
        ProjetoService.findList()
            .then((response) => {
                setProjetos(response);
            })
            .catch(error => console.log(error));
    }, []);

    const exportDatabase = async () => {
        setIsLoadingDatabase(true);

        let coletas = [];
        if(option === -1) {
            console.log('lool')
            coletas = await ColetaService.findAll()
                .catch(error => {
                    Alert.alert(
                        "Erro",
                        "Ocorreu um erro ao tentar obter os registros de Coleta do banco de dados.",
                        [{ text: "OK", style: "default" }],
                        { cancelable: true }
                    );
                });
        } else {
            console.log('lssool')
            coletas = await ColetaService.findByProjetoId(option ? option : null)
                .catch(error => {
                    Alert.alert(
                        "Erro",
                        "Ocorreu um erro ao tentar obter os registros de Coleta do banco de dados.",
                        [{ text: "OK", style: "default" }],
                        { cancelable: true }
                    );
                });
        }

        if(coletas.length) {
            let filteredColetas = coletas.map((item) => {
                return formatColetaData(item);
            });
            
            let coletasCSV = jsonToCSV(filteredColetas);
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
        } else {
            Alert.alert(
                    "Aviso",
                    "Não existem registros de Coleta para a opção selecionada.",
                    [{ text: "OK", style: "default" }],
                    { cancelable: true }
                );
        }
        setIsLoadingDatabase(false);
    }

    return (
        <ScrollView flex={1} bg="#fafafa">
            <VStack mx="3" my="2">
                <Heading size="md" mb="1" style={{ color:'#404040' }}>Exportar Coletas</Heading>
                <Text my="1" fontSize="md" style={{ textAlign:'justify', color:'#525252' }}>
                    Selecione abaixo o conjuto desejado para exportar os registros de coletas em formato CSV.
                </Text>

                <View style={{borderRadius:4, overflow:'hidden', padding:0}}>
                    <Picker
                        style={{
                            backgroundColor: '#e5e5e5',
                            padding: '2%',
                            overflow: 'hidden',
                            fontSize: 16,
                            color: 'black'
                        }}
                        selectedValue={option}
                        onValueChange={(value) => setOption(value)}>
                        <Picker.Item label="Todas" value={-1} />
                        <Picker.Item label="Sem projeto" value={0} />
                        {
                            projetos.map((item, index) => { 
                                return (<Picker.Item label={item.nome} value={item.id} key={index.toString()} />)
                            })
                        }
                    </Picker>
                </View>

                <Button 
                    isLoading={isLoadingDatabase} size="md" 
                    my="2" bg="green.500" colorScheme="green"
                    _text={{ fontSize:16 }}
                    _loading={{
                        bg: "green",
                        _text: { color: "white" }
                    }}
                    _spinner={{ color: "white" }}
                    isLoadingText="Gerando arquvio"
                    onPress={() => exportDatabase()}>
                    Gerar arquivo CSV
                </Button>
            
                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="1" style={{ color:'#404040' }}>Fotos de Coletas</Heading>
                <Text my="1" fontSize="md" style={{ textAlign:'justify', color:'#525252' }}>
                    Todas as fotografias associadas a registros de coleta são armazenadas na 
                    pasta <Text italic>"Collectfy"</Text>, em pastas com o nome do Projeto correspondente. 
                    Também estão armazenadas em álbuns de mesmo nome, na galeria do dispositivo.
                </Text>
                <Text my="1" fontSize="md" style={{ textAlign:'justify', color:'#525252' }}>
                    As coletas sem projeto associado, estão na pasta e álbum de nome "Sem projeto".
                </Text> 
            </VStack>
        </ScrollView>
    );
}

export default DadosScreen;