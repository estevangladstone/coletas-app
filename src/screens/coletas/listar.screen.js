import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ColetaService from '../../services/ColetaService';
import ColetaCard from './components/coleta-card';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { 
    Box, Heading, Button, FlatList, VStack, Fab, Icon, Text, Center, Spinner
} from 'native-base';


const ListarColetaScreen = (props) => {

    const [coletas, setColetas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [haveMore, setHaveMore] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', async () => {
            await listar();
        });

        return unsubscribe;
    }, [props.navigation]);

    const listar = async () => {
        await ColetaService.fetchMore(7, 0)
            .then(response => {
                if(response.length == 0) {
                    setHaveMore(false);
                }
                console.log('30 = ', response)
                setColetas(response);
                setIsLoading(false);
            });
    }

    const fetchMore = async () => {
        if(!haveMore) { return null }
            
        setIsLoading(true);    
        await ColetaService.fetchMore(5, coletas.length)
            .then(response => {
                if(response.length == 0) {
                    console.log('32 = ', response)
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
                        onEndReached={async () => await fetchMore()}
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
                </Box> : null }
                { coletas.length == 0 && !haveMore ? 
                <Box style={{
                        justifyContent: 'center', //Centered horizontally
                        alignItems: 'center', //Centered vertically
                        flex:0.7 
                    }}>
                    <MaterialCommunityIcons name="leaf" size={100} color="#a3a3a3"/>
                    <Text
                        my={3}
                        px={2}
                        fontSize="lg" 
                        style={{
                            color: "#737373",
                            textAlign: 'center' 
                        }}>
                    Ainda não existem registros de coletas cadastrados.</Text>
                </Box> : null }
                
                { isFocused ?
                <Fab
                    size="lg"
                    borderRadius="full"
                    colorScheme="green"
                    placement="bottom-right"
                    icon={
                        <Icon
                            color="white"
                            as={<MaterialCommunityIcons name="plus" />}
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