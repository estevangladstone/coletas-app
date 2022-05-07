import React, { useState, useEffect } from 'react';
import { Alert, BackHandler, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Heading, Button, VStack, HStack, Image, Divider, Select, CheckIcon } from 'native-base';

import Coleta from '../../models/Coleta';
import ColetaService from '../../services/ColetaService';
import FileService from '../../services/FileService';
import ConfiguracaoService from '../../services/ConfiguracaoService';

import TextField from './components/text-field';
import TextAreaField from './components/textarea-field';
import DatetimeField from './components/datetime-field';

import CameraControls from './components/camera-controls';
import LocationControls from './components/location-controls';
import ProjetoSelectField from './components/projeto-select-field';


const CriarColetaScreen = (props) => {

    const [coleta, setColeta] = useState(new Coleta);
    const [errors, setErrors] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextNumeroColeta, setNextNumeroColeta] = useState(null);
    const [projetoName, setProjetoName] = useState(null);

    useEffect(() => {
        async function prepare() {
            await FileService.deleteTempFile();
            
            const numCol = await ConfiguracaoService.findNextNumeroColeta();
            const coletor = await ConfiguracaoService.findNomeColetor();

            setNextNumeroColeta((parseInt(numCol)).toString());
            setColeta({ 
                ...coleta, 
                data_hora: new Date(),
                numero_coleta: numCol ? (parseInt(numCol)).toString() : '1',
                coletor_principal: coletor,
                pais: 'Brasil',
            });
        }

        prepare();
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            updatePhotosList();
        });

        return unsubscribe;
    }, [props.navigation]);

    const validate = async () => {
        let errorList = {};

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
            coleta, photoList, projetoName
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
            setIsLoading(false);
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                [{ text: "OK", style: "default" }] );
        });
    };
    
    const confirmExit = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que quer descartar os dados preenchidos (incluíndo fotos)?",
            [
                { text: "NÃO", style: "cancel" },
                { text: "SIM", onPress: async () => {
                    await FileService.deleteTempFile();
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
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView style={{flex: 1, backgroundColor:'#fafafa'}}>
                <VStack mx="3" my="2">

                    <CameraControls 
                        photos={photoList} 
                        openCamera={openCamera} 
                        removePhoto={popPhoto} />
                        
                    <DatetimeField
                        value={coleta.data_hora}
                        setValue={(value) => setColeta({...coleta, data_hora:value})}/>
                    <TextField 
                        label="Número da Coleta"
                        value={coleta.numero_coleta}
                        keyboardType="numeric"
                        setValue={(value) => { 
                            setColeta({...coleta, numero_coleta:value})
                            setErrors({}) 
                        }}
                        isInvalid={'numero_coleta' in errors}
                        errorMessage={"Número inválido ou já existe Coleta com esse número. O próximo número disponível é "+nextNumeroColeta}/>
                    <TextField 
                        label="Coletor principal"
                        value={coleta.coletor_principal}
                        setValue={(value) => setColeta({...coleta, coletor_principal:value})}/>
                    <TextField 
                        label="Outros coletores"
                        value={coleta.outros_coletores}
                        setValue={(value) => setColeta({...coleta, outros_coletores:value})}/>

                    <ProjetoSelectField 
                        label="Projeto"
                        value={projetoName}
                        setValue={(value) => setProjetoName(value)} />

                    <Divider my="2" backgroundColor="#a3a3a3" />
                    <Heading size="md" mb="2">Espécime</Heading>

                    <TextField 
                        label="Espécie"
                        value={coleta.especie}
                        setValue={(value) => setColeta({...coleta, especie:value})}/>
                    <TextField 
                        label="Família"
                        value={coleta.familia}
                        setValue={(value) => setColeta({...coleta, familia:value})}/>
                    <TextField 
                        label="Hábito de crescimento"
                        value={coleta.habito_crescimento}
                        setValue={(value) => setColeta({...coleta, habito_crescimento:value})}/>
                    <TextAreaField 
                        label="Descrição do Espécime"
                        value={coleta.descricao_especime}
                        helperText="Ex.: cor da flor ou fruto, odores, filotaxia, altura, etc."
                        setValue={(value) => setColeta({...coleta, descricao_especime:value})}/>
                    <TextField 
                        label="Substrato"
                        value={coleta.substrato}
                        setValue={(value) => setColeta({...coleta, substrato:value})}/>
                    <TextAreaField 
                        label="Descrição do Local"
                        value={coleta.descricao_local}
                        setValue={(value) => setColeta({...coleta, descricao_local:value})}/>

                    <Divider my="2" backgroundColor="#a3a3a3" />
                    <Heading size="md" mb="2">Localização</Heading>
                    
                    <HStack>
                        <View style={{width: '85%'}}>
                            <TextField 
                                label="Longitude"
                                value={coleta.longitude}
                                setValue={(value) => setColeta({ ...coleta, longitude:value })} />
                            <TextField 
                                label="Latitude"
                                value={coleta.latitude}
                                setValue={(value) => setColeta({ ...coleta, latitude:value })} />
                            <TextField 
                                label="Altitude (em metros)"
                                value={coleta.altitude}
                                setValue={(value) => setColeta({ ...coleta, altitude:value })} />
                        </View>

                        <LocationControls 
                            setLocationData={(values) => setColeta({...coleta, ...values})} />
                    </HStack>

                    <TextField 
                        label="País"
                        value={coleta.pais}
                        setValue={(value) => setColeta({...coleta, pais:value})}/>
                    <TextField 
                        label="Estado"
                        value={coleta.estado}
                        setValue={(value) => setColeta({...coleta, estado:value})}/>
                    <TextAreaField 
                        label="Localidade"
                        value={coleta.localidade}
                        setValue={(value) => setColeta({...coleta, localidade:value})}/>

                    <Divider my="2" backgroundColor="#a3a3a3" />

                    <TextAreaField 
                        label="Observações"
                        value={coleta.observacoes}
                        setValue={(value) => setColeta({...coleta, observacoes:value})}/>

                    <Button 
                        isLoading={isLoading} size="lg" mt="2" bg="green.500" colorScheme="green"
                        _loading={{
                            bg: "green",
                            _text: { color: "white" }
                        }}
                        _spinner={{ color: "white" }}
                        isLoadingText="Salvando"
                        onPress={async () => await onSubmit()}>
                        Salvar
                    </Button>
                    <Button size="lg" colorScheme="danger" variant="outline" mt="2"
                        onPress={confirmExit}>
                        Cancelar
                    </Button>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>);
}

export default CriarColetaScreen;
