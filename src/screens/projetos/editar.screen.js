import React, { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, View } from 'react-native';
import { 
    ScrollView, VStack, Button, Divider, Heading, HStack, Icon
} from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";

import TextField from '../coletas/components/text-field';
import TextAreaField from '../coletas/components/textarea-field';
import ProjetoService from '../../services/ProjetoService';
import Projeto from '../../models/Projeto';


const EditarProjetoScreen = (props) => {

    const [projeto, setProjeto] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [currNome, setCurrNome] = useState(false);

    useEffect(() => {
        ProjetoService.findById(props.route.params.id)
        .then((response) => { 
            setProjeto(response._array[0]);
            setCurrNome(response._array[0].nome);
        })
        .catch((error) => {
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar abrir o projeto.",
                [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
            );
        });
    }, []);

    const validate = async () => {
        if(!projeto.nome) {
            setErrors({ nome: 'O campo Nome é obrigatório.' });
            return false;
        } else if(await ProjetoService.findByNome(projeto.nome) && projeto.nome != currNome) {
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

        await ProjetoService.update(
            projeto
        ).then(async () => {
            setIsLoading(false);
            Alert.alert(
                "Sucesso",
                "Projeto atualizado com sucesso!",
                [{  text: "OK",
                    onPress: () => props.navigation.goBack(),
                    style: "default" }],
                { cancelable: true });
        })
        .catch(() => {
            setIsLoading(false);
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar salvar o Projeto.",
                [{ text: "OK", style: "default" }]);
        });
    }

    const confirmExit = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que quer descartar os dados preenchidos?",
            [
                { text: "NÃO", style: "cancel" },
                { text: "SIM", onPress: async () => props.navigation.goBack(), style: "destructive" },
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
                        errorMessage={errors.nome}/>
                    <TextAreaField 
                        label="Descrição"
                        value={projeto.descricao}
                        setValue={(value) => setProjeto({...projeto, descricao:value})}/>

                    <Button 
                        isLoading={isLoading} size="lg" mt="2" colorScheme="green"
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

export default EditarProjetoScreen;
