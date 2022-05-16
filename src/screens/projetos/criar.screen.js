import React, { useState, useEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { Alert, KeyboardAvoidingView, BackHandler } from 'react-native';
import { ScrollView, VStack, Button, Divider, Heading } from 'native-base';
import TextField from '../coletas/components/text-field';
import TextAreaField from '../coletas/components/textarea-field';
import ProjetoService from '../../services/ProjetoService';
import Projeto from '../../models/Projeto';


const CriarProjetoScreen = (props) => {

    const [projeto, setProjeto] = useState(new Projeto);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const backAction = () => {
            confirmExit();
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, []);

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
        if(!projeto.nome) {
            setErrors({ nome: 'O campo Nome é obrigatório.' });
            return false;
        } else if(await ProjetoService.findByNome(projeto.nome)) {
            setErrors({ nome: 'Já existe Projeto com este nome.' });
            return false;
        } else if(projeto.nome?.toLowerCase() == 'sem projeto') {
            setErrors({ nome: 'Este nome não é permitido.' });
            return false;
        }
        return true;
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

        await ProjetoService.create(
            projeto
        ).then((insertId) => {
            if(!insertId) {
                Alert.alert(
                    "Erro",
                    "Ocorreu um problema ao tentar salvar o Projeto.",
                    [{ text: "OK", style: "default" }] );
            } else {
                setIsLoading(false);
                Alert.alert(
                    "Sucesso",
                    "Projeto criado com sucesso!",
                    [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }]);
            }
        }).catch(() => {
            setIsLoading(false);
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o Projeto.",
                [{ text: "OK", style: "default" }] );
        });
    }

    const confirmExit = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que quer descartar os dados preenchidos?",
            [
                { text: "CANCELAR", style: "cancel" },
                { text: "SAIR", onPress: async () => props.navigation.goBack(), style: "destructive" },
            ],
            { cancelable: true }
        );
    }

    return (
        <KeyboardAvoidingView style={{flex:1}}>
            <ScrollView flex={1} bg="#fafafa">
                <VStack mx="3" my="2">
                    <TextField 
                        label="Nome"
                        value={projeto.nome}
                        setValue={(value) => {
                            setProjeto({...projeto, nome:value});
                            setErrors({});
                        }}
                        isInvalid={'nome' in errors}
                        errorMessage={errors.nome} />
                    <TextAreaField 
                        label="Descrição"
                        value={projeto.descricao}
                        setValue={(value) => setProjeto({...projeto, descricao:value})} />

                    <Button 
                        isLoading={isLoading} size="md" 
                        mt="2" bg="green.500" colorScheme="green"
                        _text={{ fontSize:16 }}
                        _loading={{
                            bg: "green",
                            _text: { color: "white" }
                        }}
                        _spinner={{ color: "white" }}
                        isLoadingText="Salvando"
                        onPress={async () => await onSubmit()}>
                        Salvar
                    </Button>
                    <Button 
                        size="md" _text={{ fontSize:16 }}
                        colorScheme="danger" variant="outline" mt="2"
                        onPress={confirmExit}>
                        Cancelar
                    </Button>
                </VStack>

            </ScrollView>
        </KeyboardAvoidingView>
    );

}

export default CriarProjetoScreen;
