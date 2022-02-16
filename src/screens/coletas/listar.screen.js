import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ColetaService from '../../services/ColetaService';
import ColetaCard from './components/coleta-card';
import { MaterialIcons } from "@expo/vector-icons";
import { 
    Box, Heading, Button, FlatList, VStack, Fab, Icon, Text, Center, Spinner
} from 'native-base';


const ListarColetaScreen = (props) => {

    const [coletas, setColetas] = useState([]);
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
        ColetaService.fetchMore(7, 0)
            .then(response => {
                if(response.length == 0) {
                    setHaveMore(false);
                }
                setColetas(response);
                setIsLoading(false);
            });
    }

    const fetchMore = () => {
        if(!haveMore) { return null }
            
        setIsLoading(true);    
        ColetaService.fetchMore(5, coletas.length)
            .then(response => {
                if(response.length == 0) {
                    setHaveMore(false);
                } else {
                    setColetas([...coletas, ...response]);
                }
                setIsLoading(false);
            });   
    }

    return (
        <Box flex={1} bg="#fafafa">
            <VStack space={2} flex={1}>
                { coletas.length > 0 ?
                <Box flex={1}>
                    <FlatList
                        data={coletas}
                        onEndReached={() => fetchMore()}
                        onEndReachedThreshold={0}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('Visualizar', { 
                                    id: item.id,
                                    title: item.numero_coleta ? 'Coleta #'+item.numero_coleta : 'Coleta S/N'
                                })}>
                                <ColetaCard item={item} />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={ isLoading ? <Spinner size="lg" p="2" color="green.500" /> : null }
                    />
                </Box> : null }
                { coletas.length == 0 && !haveMore ? 
                <Center my="3">
                    <Text fontSize="md">
                    Não existem registros de Coletas cadastrados.</Text>
                </Center> : null }
                
                { isFocused ?
                <Fab
                    size="lg"
                    borderRadius="full"
                    colorScheme="green"
                    placement="bottom-right"
                    icon={
                        <Icon
                            color="white"
                            as={<MaterialIcons name="add" />}
                            size="7"
                        />
                    }
                    label="Nova Coleta"
                    onPress={() => props.navigation.navigate('Criar')}
                    renderInPortal={false}
                />
                : null }
            </VStack>
        </Box>
    );

}

export default ListarColetaScreen;