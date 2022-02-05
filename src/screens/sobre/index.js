import React from 'react';
import { Alert } from 'react-native';
import { Box, VStack, Button, Divider, Heading, Text } from 'native-base';


const SobreScreen = (props) => {

    return (
        <Box flex={1} bg="#fff">
            <VStack mx="3" my="2">
                <Heading size="md" mb="1">Sobre</Heading>
                <Text my="1">
                    Texto informativo sobre o aplicativo, objetivo e links para projeto no github e arquivo do TCC ?
                </Text>
            </VStack>
        </Box>
    );
}

export default SobreScreen;