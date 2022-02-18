import React from 'react';
import { View, Image } from 'react-native';
import { VStack, Text, HStack, Spacer, Icon, Heading } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDatetime } from '../../../helpers';


const ProjetoCard = ({item}) => {
    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderColor: '#e5e7eb',
                padding: '2%',
            }} >
            <Heading isTruncated size="sm" fontSize={18} color="coolGray.800" bold>
                { item.nome } 
            </Heading>
            <Text isTruncated w="100%" color="coolGray.600" fontSize={16}>
                {item.descricao ?? 'Sem descrição'} 
            </Text>
            <Text isTruncated w="100%" color="coolGray.600" fontSize={16}>
                16 coletas associadas 
            </Text>
            <Text isTruncated w="100%" color="coolGray.600" fontSize={15}>
                Atualizado em { formatDatetime(item.updated_at) } 
            </Text>
        </View>
    );
}

export default ProjetoCard;