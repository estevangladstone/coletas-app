import React from 'react';
import { View, Image } from 'react-native';
import { VStack, Text, HStack, Spacer, Icon, Heading, Badge } from 'native-base';
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
            <HStack space={2}>
                <View 
                    style={{
                        minWidth: 75,
                        aspectRatio: 1, 
                        height: 'auto', 
                        borderRadius: 5,
                        backgroundColor:'#e5e5e5',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'  
                    }} >
                    <HStack>
                        <Badge
                            colorScheme="green"
                            rounded="full"
                            mb={-5} mr={-5} zIndex={1}
                            variant="solid"
                            alignSelf="center"
                            _text={{
                                fontSize: 14
                            }}>
                            { Number(item.qtd_coletas) }
                        </Badge>
                        <Icon
                            as={<MaterialCommunityIcons name="tag" />}
                            size="xl"
                        />
                    </HStack>
                </View>
                <VStack flex={1}>
                    <Heading isTruncated size="sm" fontSize={18} color="coolGray.800" bold>
                        { item.nome } 
                    </Heading>
                    <Text isTruncated w="100%" color="coolGray.600" fontSize={16}>
                        { item.descricao ?? 'Sem descrição' } 
                    </Text>
                    <Text isTruncated w="100%" color="coolGray.600" fontSize={15}>
                        Atualizado em { formatDatetime(item.updated_at) } 
                    </Text>
                </VStack>
            </HStack>
        </View>
    );
}

export default ProjetoCard;