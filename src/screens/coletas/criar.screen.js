import React, { useState, useEffect } from 'react';
import { Alert, BackHandler, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
    Heading, Button, VStack, HStack, Image, Icon, Divider    
} from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";

import Coleta from '../../models/Coleta';
import ColetaService from '../../services/ColetaService';
import FileService from '../../services/FileService';
import ConfiguracaoService from '../../services/ConfiguracaoService';

import ColetaTextField from './components/coleta-text-field';
import ColetaTextAreaField from './components/coleta-textarea-field';
import ColetaDatetimeField from './components/coleta-datetime-field';

import CameraControls from './components/camera-controls';
import LocationControls from './components/location-controls';


const CriarColetaScreen = (props) => {

    const [coleta, setColeta] = useState(new Coleta);
    const [errors, setErrors] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextNumeroColeta, setNextNumeroColeta] = useState(null);

    useEffect(async () => {
        await FileService.deleteTempFiles();
        
        const numCol = await ConfiguracaoService.findNextNumeroColeta();
        const coletor = await ConfiguracaoService.findNomeColetor();

        setNextNumeroColeta((parseInt(numCol)).toString());
        setColeta({ 
            ...coleta, 
            data_hora: new Date(),
            numero_coleta: numCol ? (parseInt(numCol)).toString() : '1',
            coletores: coletor,
            pais: 'Brasil',
        });
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            updatePhotosList();
        });

        return unsubscribe;
    }, [props.navigation]);

    const validate = async () => {
        let errorList = {};

        if(isNaN(Number(coleta.longitude))) { 
            errorList = {...errorList, longitude:true};
        }
        if(isNaN(Number(coleta.latitude))) { 
            errorList = {...errorList, latitude:true};
        }
        if(isNaN(Number(coleta.altitude))) { 
            errorList = {...errorList, altitude:true};
        }

        let num = Number(coleta.numero_coleta);
        if((num && !Number.isInteger(num)) || num && num < 1 
            || (num && parseInt(coleta.numero_coleta).toString() != coleta.numero_coleta)) {
            errorList = {...errorList, numero_coleta:true};
        } else if(await ColetaService.findByNumeroColeta(num)) {
            errorList = {...errorList, numero_coleta:true};
        }

        if(Object.keys(errorList).length) {
            setErrors({...errors, ...errorList})
            return false;
        } else {
            return true;
        }

        return isValid;
    }

    const onSubmit = async () => {
        setIsLoading(true);
        if(!(await validate())) {
            setIsLoading(false);
            Alert.alert(
                "Aviso",
                "Existem erros nos dados preenchidos. Realize os ajustes necessários e tente novamente.",
                [{ text: "OK", style: "default" }] );
            return false;
        } 

        ColetaService.create(
            coleta, photoList
        ).then((insertId) => {
            if(!insertId) {
                Alert.alert(
                    "Erro",
                    "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                    [{ text: "OK", style: "default" }] );
            } else {
                setIsLoading(false);
                Alert.alert(
                    "Sucesso",
                    "Registro de coleta criado com sucesso!",
                    [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }]);
            }
        }).catch((erro) => {
            console.log(erro)
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                [{ text: "OK", style: "default" }] );
        });
    };
    
    const confirmExit = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que quer descartar os dados preenchidos (incluíndo fotos) e retornar a tela de Coletas?",
            [
                { text: "NÃO", style: "cancel" },
                { text: "SIM", onPress: async () => {
                    await FileService.deleteTempFiles();
                    props.navigation.goBack();
                }, style: "destructive" },
            ],
            { cancelable: true }
        );
    }

    const openCamera = () => {
        props.navigation.navigate('Camera');
    }

    const updatePhotosList = async () => {
        let photos = await FileService.getTempContents();
        setPhotoList(photos);
    }

    const popPhoto = (photo) => {
        setPhotoList(photoList.filter((item) => { 
            return item !== photo;
        }));
    }

    return (
        <ScrollView  style={{flex: 1, backgroundColor:'#fff'}}>
            <VStack mx="3" my="2">

                <CameraControls 
                    photos={photoList} 
                    openCamera={openCamera} 
                    removePhoto={popPhoto} />
                    
                <ColetaDatetimeField
                    value={coleta.data_hora}
                    setValue={(value) => setColeta({...coleta, data_hora:value})}/>
                <ColetaTextField 
                    label="Número da Coleta"
                    value={coleta.numero_coleta}
                    keyboardType="numeric"
                    setValue={(value) => { 
                        setColeta({...coleta, numero_coleta:value})
                        setErrors({}) 
                    }}
                    isInvalid={'numero_coleta' in errors}
                    errorMessage={"Número inválido ou já existe Coleta com esse número. O próximo número disponível é "+nextNumeroColeta}/>
                <ColetaTextField 
                    label="Coletor (ou Coletores)"
                    value={coleta.coletores}
                    setValue={(value) => setColeta({...coleta, coletores:value})}/>

                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="2">Espécime</Heading>

                <ColetaTextField 
                    label="Espécie"
                    value={coleta.especie}
                    setValue={(value) => setColeta({...coleta, especie:value})}/>
                <ColetaTextField 
                    label="Família"
                    value={coleta.familia}
                    setValue={(value) => setColeta({...coleta, familia:value})}/>
                <ColetaTextField 
                    label="Hábito de crescimento"
                    value={coleta.habito_crescimento}
                    setValue={(value) => setColeta({...coleta, habito_crescimento:value})}/>
                <ColetaTextAreaField 
                    label="Descrição do Espécime"
                    value={coleta.descricao_especime}
                    helperText="Ex.: cor da flor ou fruto, odores, filotaxia, altura, etc."
                    setValue={(value) => setColeta({...coleta, descricao_especime:value})}/>
                <ColetaTextField 
                    label="Substrato"
                    value={coleta.substrato}
                    setValue={(value) => setColeta({...coleta, substrato:value})}/>
                <ColetaTextAreaField 
                    label="Descrição do Local"
                    value={coleta.descricao_local}
                    setValue={(value) => setColeta({...coleta, descricao_local:value})}/>

                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="2">Localização</Heading>
                
                <HStack>
                    <View style={{width: '85%'}}>
                        <ColetaTextField 
                            label="Longitude"
                            value={coleta.longitude}
                            setValue={(value) => { 
                                setColeta({ ...coleta, longitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'longitude' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."/>
                        <ColetaTextField 
                            label="Latitude"
                            value={coleta.latitude}
                            setValue={(value) => { 
                                setColeta({ ...coleta, latitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'latitude' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."/>
                        <ColetaTextField 
                            label="Altitude (em metros)"
                            value={coleta.altitude}
                            setValue={(value) => { 
                                setColeta({ ...coleta, altitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'altitude' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."/>
                    </View>

                    <LocationControls 
                        setLocationData={(values) => setColeta({...coleta, ...values})} />
                </HStack>

                <ColetaTextField 
                    label="País"
                    value={coleta.pais}
                    setValue={(value) => setColeta({...coleta, pais:value})}/>
                <ColetaTextField 
                    label="Estado"
                    value={coleta.estado}
                    setValue={(value) => setColeta({...coleta, estado:value})}/>
                <ColetaTextAreaField 
                    label="Localidade"
                    value={coleta.localidade}
                    setValue={(value) => {
                        setColeta({...coleta, localidade:value});
                    }}/>

                <Divider my="2" backgroundColor="#a3a3a3" />

                <ColetaTextAreaField 
                    label="Observações"
                    value={coleta.observacoes}
                    setValue={(value) => setColeta({...coleta, observacoes:value})}/>

                <Button 
                    size="lg" mt="2" colorScheme="green"
                    onPress={async () => await onSubmit()}>
                    Salvar
                </Button>
                <Button size="lg" colorScheme="danger" variant="ghost" mt="2"
                    onPress={confirmExit}>
                    Sair
                </Button>
            </VStack>
        </ScrollView>);
}

export default CriarColetaScreen;