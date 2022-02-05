import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import ColetaService from '../../services/ColetaService';
import ColetaCard from './components/coleta-card';
import { MaterialIcons } from "@expo/vector-icons";
import { 
    Box, Heading, Button, FlatList, VStack, Fab, Icon, Pressable, Image, Text, Center
} from 'native-base';
import CameraScreen from './camera.screen';


const ListarColetaScreen = (props) => {

    const [coletas, setColetas] = useState([]);
    const [startCamera, setStartCamera] = useState(false);
    const [photoList, setPhotoList] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            listar();
        });

        return unsubscribe;
    }, [props.navigation]);

    const listar = () => {
        ColetaService.findAll()
            .then(response => setColetas(response));
    }

    return (
        <Box flex={1} bg="#fff">
            <VStack space={2} flex={1}>
                { coletas.length > 0 ?
                <FlatList
                    data={coletas}
                    renderItem={({item}) => (
                        <Pressable
                            onPress={() => props.navigation.navigate('Editar', { id:item.id })}>
                            <ColetaCard item={item} />
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                : 
                <Center my="3">
                    <Text fontSize="md">
                    Não existem registros de Coletas cadastrados.</Text>
                </Center> }
                
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