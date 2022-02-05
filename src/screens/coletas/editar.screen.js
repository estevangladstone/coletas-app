import React, { useState, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
    ScrollView, Heading, Button, FormControl, Input, VStack, HStack, FlatList, Pressable, 
    Image, Box, Icon, Divider    
} from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";

import Coleta from '../../models/Coleta';
import ColetaService from '../../services/ColetaService';
import FileService from '../../services/FileService';
import ConfiguracaoService from '../../services/ConfiguracaoService';

import ColetaTextField from './components/coleta-text-field';
import ColetaTextAreaField from './components/coleta-textarea-field';
import ColetaDatetimeField from './components/coleta-datetime-field';

import CameraScreen from './camera.screen';
import CameraControls from './components/camera-controls';
import LocationControls from './components/location-controls';

import LoadingOverlay from './components/loading-overlay';


const CriarColetaScreen = (props) => {

    const [coleta, setColeta] = useState(new Coleta);
    const [errors, setErrors] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [startCamera, setStartCamera] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nextNumeroColeta, setNextNumeroColeta] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [isPreparing, setIsPreparing] = useState(true);

    useEffect(async () => {
        const numCol = await ConfiguracaoService.findNextNumeroColeta();
        setNextNumeroColeta(numCol);

        ColetaService.findById(props.route.params.id)
        .then((response) => { 
            if(Array.isArray(response._array) && response._array.length > 0) {
                setColeta({
                    ...response._array[0],
                    data_hora: new Date(response._array[0].data_hora),
                    numero_coleta: response._array[0].numero_coleta.toString(),
                    longitude: coleta.longitude ? coleta.longitude.toString() : '',
                    latitude: coleta.latitude ? coleta.latitude.toString() : '',
                    altitude: coleta.altitude ? coleta.altitude.toString() : '',
                });
            }
            setIsPreparing(false);
        })
        .catch((error) => {
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar abrir a coleta.",
                [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
            );
        });

        ColetaService.getPhotosListById(props.route.params.id)
        .then((photos) => {
            setPhotoList(photos);
        }).catch((error) => {
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar abrir as fotos da coleta.",
                [{ text: "OK", style: "default" }],
            );
        });
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (startCamera) {
                    closeCamera();
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [startCamera, closeCamera])
    );

    const validate = () => {
        let isValid = true;

        let floatReg = new RegExp('-?[0-9]+\.?[0-9]*');
        // validar numero de coleta
        if(coleta.longitude && !floatReg.test(coleta.longitude)) { 
            setErrors({...errors, longitude:true});
            isValid = false; 
        }
        if(coleta.latitude && !floatReg.test(coleta.latitude)) { 
            setErrors({...errors, latitude:true});
            isValid = false; 
        }
        if(coleta.altitude && !floatReg.test(coleta.altitude)) { 
            setErrors({...errors, altitude:true});
            isValid = false; 
        }
        if(coleta.numero_coleta && coleta.numero_coleta < nextNumeroColeta) {
            setErrors({...errors, numero_coleta:true });
            isValid = false;
        }

        return isValid;
    }

    const onSubmit = () => {
        setIsLoading(true);
        if(!validate()) {
            setIsLoading(false);
            return false;
        } 
        
        ColetaService.updateById({
            ...coleta,
            data_hora: coleta.data_hora.toISOString(),
            numero_coleta: coleta.numero_coleta ? parseInt(coleta.numero_coleta) : null,
            longitude: coleta.longitude ? parseFloat(coleta.longitude) : null,
            latitude: coleta.latitude ? parseFloat(coleta.latitude) : null,
            altitude: coleta.altitude ? parseFloat(coleta.altitude) : null,
        }, coleta.id)
        .then(async () => {
            try {
                let photosDir = 'registro_'+coleta.id;
                if(photoList.length > 0) {
                    /* deleta as que precisa, e move o resto com NOVOS NOMES */
                    ColetaService.getPhotosListById(props.route.params.id)
                    .then(async (currentPhotos) => {
                        let toRemove = currentPhotos.filter(
                            item => !photoList.includes(item)
                        );
                        toRemove.forEach(async (item) => { 
                            await FileService.deleteFile(item, true);
                        });

                        let savedPhotos = await FileService.saveBatch(
                            photoList, photosDir, coleta.coletores, coleta.numero_coleta
                        );
                        if(savedPhotos.length > 0) {
                            // TODO: fazer um create thumbnail no FileService para diminuir a imagem
                            let thumbnail = FileService.getFileUri(
                                photosDir+'/'+savedPhotos[0]
                            );  
                            ColetaService.updateThumbnailById(thumbnail, coleta.id);
                        }
                    }).catch(() => {
                        Alert.alert(
                            "Erro",
                            "Ocorreu um problema ao tentar salvar as fotos da Coleta.",
                            [{ text: "OK", style: "default" }]
                        );
                    });
                } else {
                    await FileService.deleteFile(photosDir+'/'); /* Remove a pasta inteira */
                    ColetaService.updateThumbnailById('', coleta.id);
                }

                Alert.alert(
                    "Sucesso",
                    "Registro de coleta atualizado com sucesso!",
                    [{  text: "OK",
                        onPress: () => props.navigation.goBack(),
                        style: "default" }],
                    { cancelable: true }
                );
            } catch(e) { 
                Alert.alert(
                    "Erro",
                    "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                    [{ text: "OK", style: "default" }]
                );
            }
        })
        .catch(() => {
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o registro de Coleta.",
                [{ text: "OK", style: "default" }]
            );
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
        props.navigation.setOptions({ headerShown:false });
        setStartCamera(true);
    }

    const closeCamera = () => {
        props.navigation.setOptions({ headerShown:true });
        setStartCamera(false);
    }
    
    const pushPhoto = (newPhoto) => {
        setPhotoList([ ...photoList, newPhoto ]);
    }

    const popPhoto = (photo) => {
        setPhotoList(photoList.filter((item) => { 
            return item !== photo 
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
        let files = await FileService.listDir('registro_'+coleta.id);
        if(files && files.length > 0) {
            files.forEach(async (item) => { 
                await FileService.deleteFile('registro_'+coleta.id+'/'+item);
            });
        }
        ColetaService.deleteById(coleta.id).then(() => {
            Alert.alert(
                "Sucesso",
                "O registro de Coleta foi removido com sucesso.",
                [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
            );
        });
    }

    return startCamera ?
        (
        <Box flex={1} bg="#fff">
            <CameraScreen closeCamera={closeCamera} savePhoto={pushPhoto} />
        </Box>
        ) : ( 
        <ScrollView flex={1} bg="#fff" scrollEnabled={!isPreparing}>
            { isPreparing ? <LoadingOverlay /> : null }
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
                    removePhoto={(photo) => popPhoto(photo)}
                    isDisabled={!canEdit}/>
                    
                <ColetaDatetimeField
                    value={coleta.data_hora}
                    setValue={(value) => setColeta({...coleta, data_hora:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextField 
                    label="Número da Coleta"
                    value={coleta.numero_coleta}
                    keyboardType="numeric"
                    setValue={(value) => setColeta({...coleta, numero_coleta:value})}
                    isInvalid={'numero_coleta' in errors}
                    errorMessage={"Já existe Coleta com esse número. O próximo número disponível é "+nextNumeroColeta}
                    isDisabled={!canEdit}/>
                <ColetaTextField 
                    label="Coletor (ou Coletores)"
                    value={coleta.coletores}
                    setValue={(value) => setColeta({...coleta, coletores:value})}
                    isDisabled={!canEdit}/>

                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="2">Espécime</Heading>

                <ColetaTextField 
                    label="Espécie"
                    value={coleta.especie}
                    setValue={(value) => setColeta({...coleta, especie:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextField 
                    label="Família"
                    value={coleta.familia}
                    setValue={(value) => setColeta({...coleta, familia:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextField 
                    label="Hábito de crescimento"
                    value={coleta.habito_crescimento}
                    setValue={(value) => setColeta({...coleta, habito_crescimento:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextAreaField 
                    label="Descrição do Espécime"
                    value={coleta.descricao_especime}
                    helperText="Ex.: cor da flor ou fruto, odores, filotaxia, altura, etc."
                    setValue={(value) => setColeta({...coleta, descricao_especime:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextField 
                    label="Substrato"
                    value={coleta.substrato}
                    setValue={(value) => setColeta({...coleta, substrato:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextAreaField 
                    label="Descrição do Local"
                    value={coleta.descricao_local}
                    setValue={(value) => setColeta({...coleta, descricao_local:value})}
                    isDisabled={!canEdit}/>

                <Divider my="2" backgroundColor="#a3a3a3" />
                <Heading size="md" mb="2">Localização</Heading>
                
                <HStack>
                    <Box w="85%">
                        <ColetaTextField 
                            label="Longitude"
                            value={coleta.longitude}
                            setValue={(value) => { 
                                setColeta({ ...coleta, longitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'numero_coleta' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."
                            isDisabled={!canEdit}/>
                        <ColetaTextField 
                            label="Latitude"
                            value={coleta.latitude}
                            setValue={(value) => { 
                                setColeta({ ...coleta, latitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'numero_coleta' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."
                            isDisabled={!canEdit}/>
                        <ColetaTextField 
                            label="Altitude (em metros)"
                            value={coleta.altitude}
                            setValue={(value) => { 
                                setColeta({ ...coleta, altitude:value })
                                setErrors({})
                            }}
                            keyboardType="numeric"
                            isInvalid={'numero_coleta' in errors}
                            errorMessage="O campo permite apenas números, pontos ou sinal negativo."
                            isDisabled={!canEdit}/>
                    </Box>

                    <LocationControls 
                        setLocationData={(values) => setColeta({...coleta, ...values})} 
                        isDisabled={!canEdit}/>
                </HStack>

                <ColetaTextField 
                    label="País"
                    value={coleta.pais}
                    setValue={(value) => setColeta({...coleta, pais:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextField 
                    label="Estado"
                    value={coleta.estado}
                    setValue={(value) => setColeta({...coleta, estado:value})}
                    isDisabled={!canEdit}/>
                <ColetaTextAreaField 
                    label="Localidade"
                    value={coleta.localidade}
                    setValue={(value) => {
                        setColeta({...coleta, localidade:value});
                    }}
                    isDisabled={!canEdit}/>

                <Divider my="2" backgroundColor="#a3a3a3" />

                <ColetaTextAreaField 
                    label="Observações"
                    value={coleta.observacoes}
                    helperText="Lembre-se de anotar informações que serão perdidas após a secagem do espécime."
                    setValue={(value) => setColeta({...coleta, observacoes:value})}
                    isDisabled={!canEdit}/>

                { canEdit ? 
                (<Box>
                    <Button 
                        isLoading={isLoading} size="lg" mt="2" colorScheme="green"
                        _loading={{
                            bg: "green",
                            _text: {
                                color: "white"
                            }
                        }}
                        _spinner={{
                            color: "white"
                        }}
                        isLoadingText="Salvando"
                        onPress={onSubmit}>
                        Salvar
                    </Button>
                    <Button size="lg" colorScheme="danger" variant="ghost" mt="2"
                        onPress={() => confirmExit()}>
                        Sair
                    </Button>
                </Box>) : null }
            </VStack>
        </ScrollView>
        );
}

export default CriarColetaScreen;