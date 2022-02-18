import React from 'react';
import { View, Image } from 'react-native';
import { VStack, Text, HStack, Spacer, Icon, Heading } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDatetime } from '../../../helpers';


const ColetaCard = ({item}) => {
    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderColor: '#e5e7eb',
                padding: '2%',
            }} >
            <HStack space={2}>
                { item.thumbnail ? 
                <Image
                    alt={'thumbnail '+item.id}
                    style={{ 
                        width:75, 
                        height:75, 
                        borderRadius: 5,
                    }}
                    source={{uri:item.thumbnail}}
                />
                :
                <View 
                    style={{
                        width: 75, 
                        height: 75, 
                        borderRadius: 5,
                        backgroundColor:'#e5e5e5',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'  
                    }} >
                    <Icon
                        as={<MaterialCommunityIcons name="leaf" />}
                        size="10"
                    />
                </View>
                }
                <VStack>
                    <Heading isTruncated size="sm" fontSize={18} color="coolGray.800" bold>
                        { item.especie ?? 'Espécie indeterminada' } 
                    </Heading>
                    <Text isTruncated w="100%" color="coolGray.600" fontSize={16}>
                        {item.localidade ?? 'Localidade indeterminada'} 
                    </Text>
                    <Text isTruncated w="100%" color="coolGray.600" fontSize={15}>
                        { formatDatetime(item.data_hora) } 
                    </Text>
                </VStack>
                <View style={{flex:1}}>
                    <Text px="2" fontSize="xl" color="coolGray.800" alignSelf="flex-end">
                        {item.numero_coleta ? '#'+item.numero_coleta : 'S/N'}
                    </Text>
                </View>
            </HStack>
        </View>
    );
}

export default ColetaCard;