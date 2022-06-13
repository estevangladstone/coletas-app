import React, { useState, useEffect } from 'react';
import { Alert, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Heading, Button, VStack, HStack, Image, Icon, Divider } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from 'expo-media-library';

import ColetaService from '../../services/ColetaService';
import ProjetoService from '../../services/ProjetoService';

import TextField from './components/text-field';
import TextAreaField from './components/textarea-field';
import DatetimeField from './components/datetime-field';

import CameraControls from './components/camera-controls';
import ProjetoSelectField from './components/projeto-select-field';
import LoadingOverlay from '../projetos/components/loading-overlay';


const EditarColetaScreen = (props) => {

    const [coleta, setColeta] = useState({});
    const [photoList, setPhotoList] = useState([]);
    const [projetoName, setProjetoName] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function prepare() {
            await ColetaService.findById(props.route.params.id)
            .then((response) => { 
                if(Array.isArray(response._array) && response._array.length > 0) {
                    let col = response._array[0]
                    setColeta({
                        ...response._array[0],
                        data_hora: new Date(col.data_hora),
                        numero_coleta: col.numero_coleta ? col.numero_coleta.toString() : '' 
                    });
                 
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
                });
            })
            .catch((error) => {
                Alert.alert(
                    "Erro",
                    "Ocorreu um problema ao tentar abrir a coleta.",
                    [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }]
                );
            });
        }

        prepare();
    }, []);

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
        const { status } = await MediaLibrary.requestPermissionsAsync(false);

        setIsDeleting(true);
        if (status === 'granted') {
            ColetaService.deleteById(coleta.id).then(() => {
                setIsDeleting(false);
                Alert.alert(
                    "Sucesso",
                    "O registro de Coleta foi removido com sucesso.",
                    [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
                );
            });
        } else {
            setIsDeleting(false);
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
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView style={{flex: 1, backgroundColor:'#fafafa'}}>
                <VStack mx="3" my="2">
                    <HStack style={{justifyContent: 'center'}}>
                        <Button size="md" _text={{ fontSize:16 }} mr="1" w="49%" 
                            colorScheme="green" variant="subtle" 
                            rightIcon={<Icon as={MaterialIcons} name="edit" size="md" />}
                            onPress={() => props.navigation.navigate('Editar', { 
                                id: coleta.id,
                                title: coleta.numero_coleta ? 'Coleta #'+coleta.numero_coleta : 'Coleta S/N'
                            })}>
                            Editar
                        </Button>
                        <Button size="md" _text={{ fontSize:16 }} ml="1" w="49%" 
                            colorScheme="danger" variant="subtle"
                            rightIcon={<Icon as={MaterialIcons} name="delete" size="md" />}
                            onPress={() => removeColeta()}>
                            Remover
                        </Button>
                    </HStack>

                    <Divider my="2" backgroundColor="#a3a3a3" />

                    <CameraControls 
                        photos={photoList} 
                        isDisabled={true}/>
                        
                    <DatetimeField
                        value={coleta.data_hora}
                        isDisabled={true}/>
                    <TextField 
                        label="Número da Coleta"
                        value={coleta.numero_coleta}
                        isDisabled={true}
                        keyboardType="numeric"/>
                    <TextField 
                        label="Coletor principal"
                        value={coleta.coletor_principal}
                        isDisabled={true}/>
                    <TextField 
                        label="Outros coletores"
                        value={coleta.outros_coletores}
                        isDisabled={true}/>

                    <ProjetoSelectField 
                        label="Projeto"
                        value={projetoName}
                        isDisabled={true}/>

                    <Divider my="2" backgroundColor="#a3a3a3" />
                    <Heading size="md" mb="2">Espécime</Heading>

                    <TextField 
                        label="Espécie"
                        value={coleta.especie}
                        isDisabled={true}/>
                    <TextField 
                        label="Família"
                        value={coleta.familia}
                        isDisabled={true}/>
                    <TextField 
                        label="Hábito de crescimento"
                        value={coleta.habito_crescimento}
                        isDisabled={true}/>
                    <TextAreaField 
                        label="Descrição do Espécime"
                        value={coleta.descricao_especime}
                        isDisabled={true}
                        helperText="Ex.: cor da flor ou fruto, odores, filotaxia, altura, etc."/>
                    <TextField 
                        label="Substrato"
                        value={coleta.substrato}
                        isDisabled={true}/>
                    <TextAreaField 
                        label="Descrição do Local"
                        value={coleta.descricao_local}
                        isDisabled={true}/>

                    <Divider my="2" backgroundColor="#a3a3a3" />
                    <Heading size="md" mb="2">Localização</Heading>
                    
                    <HStack>
                        <View style={{width: '85%'}}>
                            <TextField 
                                label="Longitude"
                                isDisabled={true}
                                value={coleta.longitude}/>
                            <TextField 
                                label="Latitude"
                                isDisabled={true}
                                value={coleta.latitude}/>
                            <TextField 
                                label="Altitude (em metros)"
                                value={coleta.altitude}
                                isDisabled={true}/>
                        </View>
                    </HStack>

                    <TextField 
                        label="País"
                        value={coleta.pais}
                        isDisabled={true}/>
                    <TextField 
                        label="Estado"
                        value={coleta.estado}
                        isDisabled={true}/>
                    <TextAreaField 
                        label="Localidade"
                        value={coleta.localidade}
                        isDisabled={true}/>

                    <Divider my="2" backgroundColor="#a3a3a3" />

                    <TextAreaField 
                        label="Observações"
                        value={coleta.observacoes}
                        isDisabled={true}/>
                </VStack>
            </ScrollView>
            
            {isDeleting && <LoadingOverlay/>}
        </KeyboardAvoidingView>);
}

export default EditarColetaScreen;