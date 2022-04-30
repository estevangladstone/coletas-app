import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { ScrollView } from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import { 
    Heading, Button, FlatList, VStack, HStack, Icon, Center, Spinner, Divider, Text
} from 'native-base';
import ProjetoService from '../../services/ProjetoService';
import ColetaService from '../../services/ColetaService';
import ColetaCard from '../coletas/components/coleta-card';
import { formatDatetime } from '../../helpers';


const VisualizarProjetoScreen = (props) => {

    const [projeto, setProjeto] = useState({});
    
    const [coletas, setColetas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [haveMore, setHaveMore] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        ProjetoService.findById(props.route.params.id)
        .then((response) => { 
            console.log(response._array[0]);
            setProjeto(response._array[0]);
        })
        .catch((error) => {
            Alert.alert(
                "Erro",
                "Ocorreu um problema ao tentar abrir o projeto.",
                [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
            );
        });
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            listar();
        });

        return unsubscribe;
    }, [props.navigation]);

    const listar = () => {
        console.log('aloo')
        ColetaService.fetchMoreByProjeto(props.route.params.id, 7, 0)
            .then(response => {
                console.log(response)
                if(response.length == 0) {
                    setHaveMore(false);
                }
                setColetas(response);
                setIsLoading(false);
            });
    };

    const fetchMoreColetas = () => {
        if(!haveMore) { return null }
            
        setIsLoading(true);    
        ColetaService.fetchMoreByProjeto(props.route.params.id, 5, coletas.length)
            .then(response => {
                if(response.length == 0) {
                    setHaveMore(false);
                } else {
                    setColetas([...coletas, ...response]);
                }
                setIsLoading(false);
            });  
    }

    const removeProjeto = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que deseja remover este Projeto? Todas as coletas ainda serão mantidas.",
            [
                { text: "NÃO", style: "cancel" },
                { text: "SIM", onPress: deleteProjeto, style: "destructive" },
            ],
            { cancelable: true }
        );
    }

    const deleteProjeto = async () => {
        ProjetoService.deleteById(projeto.id).then(() => {
            Alert.alert(
                "Sucesso",
                "O Projeto foi removido com sucesso.",
                [{ text: "OK", onPress: () => props.navigation.goBack(), style: "default" }],
            );
        });
    }

    return (
        <ScrollView style={{flex:1, backgroundColor:'#fafafa'}} nestedScrollEnabled>
            <VStack>
                <View style={{padding:'3%'}}>
                    <Text w="100%" color="coolGray.600" my="2" fontSize={16}>
                        {projeto.descricao ?? 'Sem descrição.'} 
                    </Text>
                    <Text w="100%" color="coolGray.600" my="2" fontSize={14}>
                        Atualizado em { formatDatetime(projeto.updated_at) } 
                    </Text>

                    <HStack style={{justifyContent: 'center'}}>
                        <Button size="lg" mr="1" w="49%" colorScheme="green" 
                            variant="subtle"
                            rightIcon={<Icon as={MaterialIcons} name="edit" size="sm" />}
                            onPress={() => props.navigation.navigate('EditarProjeto', { 
                                id: item.id,
                                title: item.nome
                            })}>
                            Editar
                        </Button>
                        <Button size="lg" ml="1" w="49%" colorScheme="danger" variant="subtle"
                            rightIcon={<Icon as={MaterialIcons} name="delete" size="sm" />}
                            onPress={() => removeProjeto()}>
                            Remover
                        </Button>
                    </HStack>
                </View>
                <Divider my="0" backgroundColor="#e5e7eb" />

                { coletas.length > 0 ?
                <View style={{ flex:1 }}>
                    <FlatList
                        data={coletas}
                        onEndReached={() => fetchMoreColetas()}
                        onEndReachedThreshold={0}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('Editar', { 
                                    id: item.id,
                                    title: item.numero_coleta ? 'Coleta #'+item.numero_coleta : 'Coleta S/N'
                                })}>
                                <ColetaCard item={item} />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={ isLoading ? <Spinner size="lg" p="2" color="green.500" /> : null }
                    />
                </View> : null }
                { coletas.length == 0 && !haveMore ? 
                <Center my="3">
                    <Text fontSize="md">
                    Não existem Coletas associadas a este Projeto.</Text>
                </Center> : null }
            </VStack>
        </ScrollView>
    );
}

export default VisualizarProjetoScreen;

