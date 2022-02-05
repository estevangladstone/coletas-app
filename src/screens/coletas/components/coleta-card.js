import React from 'react';
import { 
    View, Image 
} from 'react-native';
import { 
    Box, VStack, HStack, Spacer, Text, Pressable, Icon, Heading
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDatetime } from '../../../helpers';


const ColetaCard = ({item}) => {
    return (
        <Box
            borderBottomWidth="1"
            borderColor="coolGray.200"
            p="2">
            <HStack space={2} justifyContent="space-between">
                { item.thumbnail ? 
                <Image
                    alt={'thumbnail '+item.id}
                    style={{ 
                        width:75, 
                        height:75, 
                        borderRadius: 5
                    }}
                    source={{uri:item.thumbnail}}
                />
                :
                <Box 
                    backgroundColor='muted.200'
                    style={{
                        width: 75, 
                        height: 75, 
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'  
                    }}>
                    <Icon
                        as={<MaterialCommunityIcons name="leaf" />}
                        size="10"
                    />
                </Box>
                }
                <VStack 
                    w="50%">
                    <Heading isTruncated size="sm" fontSize={18} color="coolGray.800" bold >
                        { item.especie ?? 'Espécie indeterminada' } 
                    </Heading>
                    <Text isTruncated w="100%" color="coolGray.600" fontSize={16}>
                        {item.localidade ?? 'Localidade indeterminada'} 
                    </Text>
                    <Text isTruncated w="100%" color="coolGray.600" fontSize={15}>
                        { formatDatetime(item.data_hora) } 
                    </Text>
                </VStack>
                <Spacer />
                <Text px="2" fontSize="xl" color="coolGray.800" alignSelf="flex-start">
                    {item.numero_coleta ? '#'+item.numero_coleta : 'S/N'}
                </Text>
            </HStack>
        </Box>
    );
}

export default ColetaCard;