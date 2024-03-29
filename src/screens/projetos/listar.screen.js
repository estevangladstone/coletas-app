import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { 
    Heading, Button, FlatList, VStack, Fab, Icon, Center, Spinner, Text
} from 'native-base';
import ProjetoService from '../../services/ProjetoService';
import ProjetoCard from './components/projeto-card';


const ListarProjetoScreen = (props) => {

    const [projetos, setProjetos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [haveMore, setHaveMore] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            listar();
        });

        return unsubscribe;
    }, [props.navigation]);

    const listar = () => {
        ProjetoService.fetchMore(7, 0)
            .then(response => {
                if(response.length == 0) {
                    setHaveMore(false);
                }
                setProjetos(response);
                setIsLoading(false);
            });
    };

    const fetchMore = () => {
        if(!haveMore) { return null }
            
        setIsLoading(true);    
        ProjetoService.fetchMore(5, projetos.length)
            .then(response => {
                if(response.length == 0) {
                    setHaveMore(false);
                } else {
                    setProjetos([...projetos, ...response]);
                }
                setIsLoading(false);
            });
    }

    return (
        <View 
            style={{
                flex: 1,
                backgroundColor: "#fafafa"
            }}>
            <VStack space={2} flex={1}>
                { projetos.length > 0 ?
                <View flex={1}>
                    <FlatList
                        data={projetos}
                        onEndReached={() => fetchMore()}
                        onEndReachedThreshold={0}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('VisualizarProjeto', { 
                                    id: item.id,
                                    title: item.nome
                                })}>
                                <ProjetoCard item={item} />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={ isLoading ? <Spinner size="lg" p="2" color="green.500" /> : null }
                    />
                </View> : null }
                { projetos.length == 0 && !haveMore ? 
                <View style={{
                        justifyContent: 'center', //Centered horizontally
                        alignItems: 'center', //Centered vertically
                        flex:0.7 
                    }}>
                    <MaterialCommunityIcons name="tag-multiple" size={100} color="#a3a3a3"/>
                    <Text
                        my={3}
                        px={2}
                        fontSize="lg" 
                        style={{
                            color: "#737373",
                            textAlign: 'center' 
                        }}>
                    Projeto é um conjunto de coletas agrupadas por tema.</Text>
                    <Text
                        px={2}
                        fontSize="lg" 
                        style={{
                            color: "#737373",
                            textAlign: 'center' 
                        }}>
                    Ainda não existem projetos cadastrados.</Text>
                </View> : null }
                
                { isFocused ?
                <Fab
                    size="lg"
                    borderRadius="full"
                    bg="green.500" colorScheme="green"
                    placement="bottom-right"
                    icon={
                        <Icon
                            color="white"
                            as={<MaterialCommunityIcons name="plus" />}
                            size="7"
                        />
                    }
                    label="Novo Projeto"
                    onPress={() => props.navigation.navigate('CriarProjeto')}
                    renderInPortal={false}
                />
                : null }
            </VStack>
        </View>
    );
}

export default ListarProjetoScreen;

