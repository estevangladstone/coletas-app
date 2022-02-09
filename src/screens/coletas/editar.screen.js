import React, { useState, useEffect } from 'react';
import { Alert, BackHandler, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
    Heading, Button, VStack, HStack, Image, Icon, Divider    
} from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";

import ColetaService from '../../services/ColetaService';
import FileService from '../../services/FileService';
import ConfiguracaoService from '../../services/ConfiguracaoService';

import ColetaTextField from './components/coleta-text-field';
import ColetaTextAreaField from './components/coleta-textarea-field';
import ColetaDatetimeField from './components/coleta-datetime-field';

import CameraControls from './components/camera-controls';
import LocationControls from './components/location-controls';


const CriarColetaScreen = (props) => {

    const [coleta, setColeta] = useState({});
    const [errors, setErrors] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextNumeroColeta, setNextNumeroColeta] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(async () => {
        await FileService.deleteTempFile();
        
        const numCol = await ConfiguracaoService.findNextNumeroColeta();
        setNextNumeroColeta(numCol);

        ColetaService.findById(props.route.params.id)
        .then((response) => { 
            if(Array.isArray(response._array) && response._array.length > 0) {
                let col = response._array[0]
                setColeta({
                    ...response._array[0],
                    data_hora: new Date(col.data_hora),
                    numero_coleta: col.numero_coleta.toString(),
                    longitude: col.longitude ? col.longitude.toString() : '',
                    latitude: col.latitude ? col.latitude.toString() : '',
                    altitude: col.altitude ? col.altitude.toString() : '',
                });
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

    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if(isReady) {
                updatePhotosList();
            }
        });

        return unsubscribe;
    }, [props.navigation, isReady]);

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
        } else if(await ColetaService.findByNumeroColeta(num) 
            && coleta.numero_coleta != props.route.params.id) {
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

    const onSubmit = () => {
        setIsLoading(true);
        if(!validate()) {
            setIsLoading(false);
            return false;
        } 
        


        ColetaService.updateById(
            coleta, photoList 
        ).then(async () => {
            Alert.alert(
                "Sucesso",
                "Registro de coleta atualizado com sucesso!",
                [{  text: "OK",
                    onPress: () => props.navigation.goBack(),
                    style: "default" }],
                { cancelable: true });
        })
        .catch(() => {
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                [{ text: "OK", style: "default" }]);
        });
    }
    
    const confirmExit = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que quer descartar as alterações realizadas e retornar a tela de Coletas?",
            [
                { text: "NÃO", style: "cancel" },
                { text: "SIM", onPress: () => props.navigation.goBack(), style: "destructive" },
            ],
            { cancelable: true }
        );
    }

    const openCamera = () => {
        props.navigation.navigate('Camera');
    }

    const updatePhotosList = async () => {
        let photos = await FileService.getTempContents();
        setPhotoList([...photoList, ...photos]);
    }

    const closeCamera = () => {
        props.navigation.setOptions({ headerShown:true });
        setStartCamera(false);
    }

    const popPhoto = (photo) => {
        setPhotoList(photoList.filter((item) => { 
            return item !== photo;
        }));
    }

    const toggleEdit = () => {
        if(canEdit) {
            setCanEdit(false);
        } else {
            setCanEdit(true);
        }
    }

    const removeColeta = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que deseja remover este registro de Coleta? Todos os dados e fotos serão perdidos.",
            [
                { text: "NÃO", style: "cancel" },
                { text: "SIM", onPress: deleteColeta, style: "destructive" },
            ],
            { cancelable: true }
        );
    }

    const deleteColeta = async () => {
        // passar atribuição para ColetaService
        await FileService.deleteTempFile();
        ColetaService.deleteById(coleta.id).then(() => {
            Alert.alert(
                "Sucesso",
                "O registro de Coleta foi removido com sucesso.",
                [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
            );
        });
    }

    return (
        <ScrollView  style={{flex: 1, backgroundColor:'#fff'}}>
            <VStack mx="3" my="2">
                <HStack style={{justifyContent: 'center'}}>
                    <Button size="lg" mr="1" w="49%" colorScheme="green"
                        onPress={() => toggleEdit()}>
                        {canEdit ? "Desabilitar Edição" : "Habilitar Edição"}
                    </Button>
                    <Button size="lg" ml="1" w="49%" colorScheme="danger"
                        onPress={() => removeColeta()}>
                        Remover
                    </Button>
                </HStack>

                <Divider my="2" backgroundColor="#a3a3a3" />

                <CameraControls 
                    photos={photoList} 
                    openCamera={openCamera} 
                    removePhoto={popPhoto} 
                    isDisabled={!canEdit}/>
                    
                <ColetaDatetimeField
                    value={coleta.data_hora}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, data_hora:value})}/>
                <ColetaTextField 
                    label="Número da Coleta"
                    value={coleta.numero_coleta}
                    isDisabled={!canEdit}
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
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, coletores:value})}/>

                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="2">Espécime</Heading>

                <ColetaTextField 
                    label="Espécie"
                    value={coleta.especie}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, especie:value})}/>
                <ColetaTextField 
                    label="Família"
                    value={coleta.familia}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, familia:value})}/>
                <ColetaTextField 
                    label="Hábito de crescimento"
                    value={coleta.habito_crescimento}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, habito_crescimento:value})}/>
                <ColetaTextAreaField 
                    label="Descrição do Espécime"
                    value={coleta.descricao_especime}
                    isDisabled={!canEdit}
                    helperText="Ex.: cor da flor ou fruto, odores, filotaxia, altura, etc."
                    setValue={(value) => setColeta({...coleta, descricao_especime:value})}/>
                <ColetaTextField 
                    label="Substrato"
                    value={coleta.substrato}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, substrato:value})}/>
                <ColetaTextAreaField 
                    label="Descrição do Local"
                    value={coleta.descricao_local}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, descricao_local:value})}/>

                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="2">Localização</Heading>
                
                <HStack>
                    <View style={{width: '85%'}}>
                        <ColetaTextField 
                            label="Longitude"
                            isDisabled={!canEdit}
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
                            isDisabled={!canEdit}
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
                            isDisabled={!canEdit}
                            setValue={(value) => { 
                                setColeta({ ...coleta, altitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'altitude' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."/>
                    </View>

                    <LocationControls 
                        setLocationData={(values) => setColeta({...coleta, ...values})} 
                        isDisabled={!canEdit} />
                </HStack>

                <ColetaTextField 
                    label="País"
                    value={coleta.pais}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, pais:value})}/>
                <ColetaTextField 
                    label="Estado"
                    value={coleta.estado}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, estado:value})}/>
                <ColetaTextAreaField 
                    label="Localidade"
                    value={coleta.localidade}
                    isDisabled={!canEdit}
                    setValue={(value) => {
                        setColeta({...coleta, localidade:value});
                    }}/>

                <Divider my="2" backgroundColor="#a3a3a3" />

                <ColetaTextAreaField 
                    label="Observações"
                    value={coleta.observacoes}
                    isDisabled={!canEdit}
                    setValue={(value) => setColeta({...coleta, observacoes:value})}/>

                { canEdit ?    
                <View>
                    <Button 
                        size="lg" mt="2" colorScheme="green"
                        onPress={async () => await onSubmit()}>
                        Salvar
                    </Button>
                    <Button size="lg" colorScheme="danger" variant="ghost" mt="2"
                        onPress={confirmExit}>
                        Sair
                    </Button>
                </View>
                : null}
            </VStack>
        </ScrollView>);
}

export default CriarColetaScreen;