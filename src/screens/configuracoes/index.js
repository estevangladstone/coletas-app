import React, { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { ScrollView, VStack, Button, Divider, Heading } from 'native-base';
import ColetaTextField from '../coletas/components/coleta-text-field';
import ConfiguracaoService from '../../services/ConfiguracaoService';
import ColetaService from '../../services/ColetaService';


const ConfiguracoesScreen = (props) => {

    const [configuracoes, setConfiguracoes] = useState({proximo_numero_coleta: '', nome_coletor: ''});
    const [maxNumCol, setMaxNumCol] = useState(null);
    const [isNumInvalid, setIsNumInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        ConfiguracaoService.findAll()
            .then(configs => {
                if(configs.length) {
                    let result = configs.reduce((obj, item) => {
                        obj[item.nome] = item.valor; 
                        return obj;
                    }, {});
                    setConfiguracoes({...configuracoes, ...result});
                }
            })
            .catch(error => {
                Alert.alert(
                    "Erro",
                    "Não foi possível obter as configurações pré-definidas.",
                    [{ text: "OK", style: "default" }],
                    { cancelable: true }
                );
            });

        ColetaService.getMaxNumeroColeta()
            .then(max => { 
                max ? setMaxNumCol(max) : setMaxNumCol(0);
            })
            .catch(error => {
                Alert.alert(
                    "Erro",
                    "Não foi possível obter as configurações pré-definidas.",
                    [{ text: "OK", style: "default" }],
                    { cancelable: true }
                );
            });
    }, []);

    const validate = () => {
        if(configuracoes.proximo_numero_coleta !== '' 
            && configuracoes.proximo_numero_coleta <= maxNumCol) {
            setIsNumInvalid(true);
            return false;
        }
        let num = Number(configuracoes.proximo_numero_coleta);
        if(!Number.isInteger(num) || num < 1) {
            setIsNumInvalid(true);
            return false;
        }
        if(!configuracoes.proximo_numero_coleta) {
            setIsNumInvalid(true);
            return false;
        }
        return true;
    }

    const onSubmit = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que deseja salvar as alterações nas configurações?",
            [{ text: "NÃO", style: "cancel" },
            { text: "SIM", onPress: saveChanges, style: "destructive" }],
            { cancelable: true }
        );
    }
    
    const saveChanges = async () => {
        setIsLoading(true);
        if(!validate()) {
            setIsLoading(false);
            return false;
        }

        await ConfiguracaoService.createOrUpdateByNome(
            'nome_coletor', configuracoes.nome_coletor);
        await ConfiguracaoService.createOrUpdateByNome(
            'proximo_numero_coleta', parseInt(configuracoes.proximo_numero_coleta));

        setIsLoading(false);
        Alert.alert(
            "Sucesso",
            "Configurações salvas com sucesso!",
            [{ text: "OK", style: "default" }],
            { cancelable: true }
        );
    }

    return (
        <KeyboardAvoidingView style={{flex:1}}>
        <ScrollView flex={1} bg="#fff">
            <VStack mx="3" my="2">
                <ColetaTextField 
                    label="Nome de Coletor padrão"
                    value={configuracoes.nome_coletor}
                    setValue={(value) => setConfiguracoes({...configuracoes, nome_coletor:value})}/>
                <ColetaTextField 
                    label="Próximo número de Coleta"
                    value={configuracoes.proximo_numero_coleta ? parseInt(configuracoes.proximo_numero_coleta).toString() : ''}
                    keyboardType="numeric"
                    setValue={(value) => { 
                        setConfiguracoes({...configuracoes, proximo_numero_coleta:parseInt(value)})
                        setIsNumInvalid(false)
                    }}
                    isInvalid={isNumInvalid}
                    errorMessage={"Número inválido ou já existe Coleta com esse número. O próximo número disponível é "+parseInt(maxNumCol+1)}/>

                <Button 
                    isLoading={isLoading} size="lg" mt="2" colorScheme="green"
                    _loading={{
                        bg: "green",
                        _text: { color: "white" }
                    }}
                    _spinner={{ color: "white" }}
                    isLoadingText="Salvando"
                    onPress={onSubmit}>
                    Salvar
                </Button>
            </VStack>
        </ScrollView>
    </KeyboardAvoidingView>);

}

export default ConfiguracoesScreen;
