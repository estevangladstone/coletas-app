import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { 
    Modal, Button, Spinner, FlatList, Text, VStack, HStack, Heading, Icon 
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDatetime } from '../../../helpers';
import ColetaCard from '../../coletas/components/coleta-card';


const ColetaSelectableCard = ({item}) => {
    const [selected, toggleSelection] = useState(false);

    return (
        <TouchableOpacity 
            onPress={() => toggleSelection(!selected)}
            style={{ flexDirection: 'row' }} >
            <ColetaCard item={item}/>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#e5e7eb'
                }}>
                <MaterialCommunityIcons 
                    color={selected ? '#22c55e' : black} size={35}
                    style={{ paddingRight: '2%' }}
                    name={selected ? 
                        "check-circle-outline" : "checkbox-blank-circle-outline"} />
            </View>
        </TouchableOpacity>
    );
}

const ColetasModal = (props) => {

    const [coletas, setColetas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setColetas([
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
            {nome:'teste', descricao:'descricao de testes'},
        ]);
        setIsLoading(false);
    }, []);

    const fetchMore = () => {
        setColetas((prevState) => { return [...prevState, {nome:'nova', descricao:'novo'}]})
    }

    return (
        <Modal size="full" isOpen={props.openModal} onClose={props.closeModal}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header style={{ borderBottomWidth: 0 }}>Coletas</Modal.Header>
                    <FlatList
                        data={coletas}
                        onEndReached={() => fetchMore()}
                        onEndReachedThreshold={0}
                        renderItem={({item}) => <ColetaSelectableCard item={item}/>}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={ isLoading ? <Spinner size="lg" p="2" color="green.500" /> : null }
                    />
                <Modal.Footer style={{backgroundColor: 'transparent'}}>
                    <Button 
                        flex={1}
                        size="lg"
                        variant="subtle" 
                        colorScheme="muted" 
                        onPress={() => props.closeModal()}>
                        Cancelar
                    </Button>
                    <Button 
                        flex={1}
                        size="lg"
                        colorScheme="green" 
                        onPress={() => props.closeModal()}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

export default ColetasModal;