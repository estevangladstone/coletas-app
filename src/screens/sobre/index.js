import React from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { ScrollView, Center, Heading, Text } from 'native-base';


const SobreScreen = () => {

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView px={3} bg="#fafafa">
                <Center m={2}>                
                    <Heading mb={2}>Collectfy</Heading> 

                    <View style={{
                        borderRadius: 95,
                        borderColor: '#404040',
                        borderWidth: 5,
                        padding: 15
                    }}>
                        <Image 
                            alt="app logo"
                            style={{ 
                                width: 150,
                                height: 150,
                            }}
                            source={require('../../assets/imgs/app_icon.png')}
                        />
                    </View>
                </Center>

                <Text fontSize="md" style={{ textAlign: 'justify' }} mb={2}>
                    <Text bold italic>Collectfy</Text> é um aplicativo móvel para anotações de coletas botânicas em campo.   
                </Text>
                <Text fontSize="md" style={{ textAlign: 'justify' }}>
                    Este aplicativo foi desenvolvido como parte do Trabalho de Conclusão de Curso do Bacharelado em Ciência da Computação da UFRJ.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SobreScreen;

