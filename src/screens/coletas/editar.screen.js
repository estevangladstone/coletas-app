import React, { useState, useEffect } from 'react';
import { Alert, BackHandler, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { Heading, Button, VStack, HStack, Image, Icon, Divider, Switch } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from 'expo-media-library';

import ColetaService from '../../services/ColetaService';
import FileService from '../../services/FileService';
import ConfiguracaoService from '../../services/ConfiguracaoService';
import ProjetoService from '../../services/ProjetoService';

import TextField from './components/text-field';
import TextAreaField from './components/textarea-field';
import DatetimeField from './components/datetime-field';

import CameraControls from './components/camera-controls';
import LocationControls from './components/location-controls';
import ProjetoSelectField from './components/projeto-select-field';
import LoadingOverlay from '../projetos/components/loading-overlay';


const EditarColetaScreen = (props) => {

    const [coleta, setColeta] = useState({});
    const [errors, setErrors] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextNumeroColeta, setNextNumeroColeta] = useState(null);
    const [currNumeroColeta, setCurrNumeroColeta] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [projetoName, setProjetoName] = useState(null);

    useEffect(() => {
        async function prepare() {
            await FileService.deleteTempFile();

            const { status } = await MediaLibrary.requestPermissionsAsync(false);

            if (status !== 'granted') {
                Alert.alert(
                    "Erro",
                    "As permissões necessárias para acesso a Galeria não foram concedidas.",
                    [{
                        text: "Voltar",
                        onPress: () => props.navigation.goBack(),
                        style: "default",
                    }],
                    { cancelable: false }
                );
            }
            
            const numCol = await ConfiguracaoService.findNextNumeroColeta();
            setNextNumeroColeta(numCol);

            await ColetaService.findById(props.route.params.id)
            .then((response) => { 
                if(Array.isArray(response._array) && response._array.length > 0) {
                    let col = response._array[0]
                    setColeta({
                        ...response._array[0],
                        data_hora: new Date(col.data_hora),
                        numero_coleta: col.numero_coleta ? col.numero_coleta.toString() : '' 
                    });
                    setCurrNumeroColeta(col.numero_coleta);
                 
                    if(col.projeto_id) {
                        ProjetoService.findById(col.projeto_id)
                        .then((projetos) => { 
                            if(projetos._array[0]) {
                                setProjetoName(projetos._array[0].nome);
                            }
                        });
                    }
                }

                ColetaService.getPhotosListById(props.route.params.id)
                .then((photos) => {
                    const photosUris = photos.map((photo) => {
                        return photo.uri;
                    });
                    setPhotoList(photosUris);
                }).then(
                    () => setIsReady(true)
                );

            })
            .catch((error) => {
                Alert.alert(
                    "Erro",
                    "Ocorreu um problema ao tentar abrir a coleta.",
                    [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
                );
            });
        }

        prepare();
        
        const backAction = () => {
            confirmExit();
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if(isReady) {
                updatePhotosList();
            }
        });

        return unsubscribe;
    }, [props.navigation, isReady, photoList]);

    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => 
                <HeaderBackButton 
                    tintColor='#fafafa'
                    style={{
                        marginLeft: -3,
                        marginRight: 30
                    }}
                    onPress={confirmExit}/>
        });
    }, [props.navigation]);

    const validate = async () => {
        let errorList = {};

        let num = Number(coleta.numero_coleta);
        if((num && !Number.isInteger(num)) || num && num < 1 
            || (num && parseInt(coleta.numero_coleta).toString() != coleta.numero_coleta)) {
            errorList = {...errorList, numero_coleta:true};
        } else if(await ColetaService.findByNumeroColeta(num) 
            && coleta.numero_coleta != currNumeroColeta) {
            errorList = {...errorList, numero_coleta:true};
        }

        if(Object.keys(errorList).length) {
            setErrors({...errors, ...errorList})
            return false;
        } else {
            return true;
        }
    }

    const onSubmit = () => {
        setIsLoading(true);
        if(!validate()) {
            setIsLoading(false);
            return false;
        } 

        ColetaService.updateById(
            coleta, photoList, projetoName
        ).then(async () => {
            setIsLoading(false);
            Alert.alert(
                "Sucesso",
                "Registro de coleta atualizado com sucesso!",
                [{  text: "OK",
                    onPress: () => props.navigation.navigate('Coletas'),
                    style: "default" }],
                { cancelable: false });
        })
        .catch(() => {
            setIsLoading(false);
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                [{ text: "OK", style: "default" }]);
        });
    }
    
    const confirmExit = () => {
        Alert.alert(
            "Confirmar",
            "Caso tenha feito alterações, elas serão descartadas.",
            [
                { text: "CANCELAR", style: "cancel" },
                { text: "SAIR", onPress: () => props.navigation.goBack(), style: "destructive" },
            ],
            { cancelable: true }
        );
    }

    const openCamera = () => {
        props.navigation.navigate('Camera');
    }

    const updatePhotosList = async () => {
        let photos = await FileService.getTempContents();
        let photosToAdd = photos.filter((item) => photoList.indexOf(item) < 0);
        setPhotoList([...photoList, ...photosToAdd]);
    }

    const closeCamera = () => {
        props.navigation.setOptions({ headerShown:true });
        setStartCamera(false);
    }

    const popPhoto = (photo) => {
        let filteredPhotos = photoList.filter((item) => { 
            return item !== photo;
        });
        setPhotoList(filteredPhotos);
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView style={{flex: 1, backgroundColor:'#fafafa'}}>
                <VStack mx="3" my="2">
                    <CameraControls 
                        photos={photoList} 
                        openCamera={openCamera} 
                        removePhoto={popPhoto}/>
                        
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
                            setLocationData={(values) => setColeta({...coleta, ...values})}/>
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
                        setValue={(value) => {
                            setColeta({...coleta, localidade:value});
                        }}/>

                    <Divider my="2" backgroundColor="#a3a3a3" />

                    <TextAreaField 
                        label="Observações"
                        value={coleta.observacoes}
                        setValue={(value) => setColeta({...coleta, observacoes:value})}/>

                    <View>
                        <Button 
                            isLoading={isLoading} size="md" _text={{ fontSize:16 }} mt="2" bg="green.500" colorScheme="green"
                            _loading={{
                                bg: "green",
                                _text: { color: "white" }
                            }}
                            _spinner={{ color: "white" }}
                            isLoadingText="Salvando"
                            onPress={async () => await onSubmit()}>
                            Salvar
                        </Button>
                        <Button size="md" _text={{ fontSize:16 }} colorScheme="danger" variant="outline" mt="2"
                            onPress={confirmExit}>
                            Cancelar
                        </Button>
                    </View>
                </VStack>
            </ScrollView>

            {isLoading && <LoadingOverlay/>}
        </KeyboardAvoidingView>);
}

export default EditarColetaScreen;