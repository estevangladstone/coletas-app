import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { ScrollView, Box, Heading, Button, Icon, Text, Center } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfiguracaoService from '../services/ConfiguracaoService';


const HomeScreen = (props) => {

    const [firstUseFlag, setFirstUseFlag] = useState(false);

    useEffect(() => {
        ConfiguracaoService.findByNome('configured_flag')
        .then(response => {
            setFirstUseFlag(response ? false : true)
        })
        .catch((error) => {});
    }, []);

    const firstConfiguration = () => {
        setFirstUseFlag(false);
        props.navigation.navigate('Configuracoes');
    } 

    return (
        <SafeAreaView style={{flex:1}}>
            <ScrollView px={5} bg="#fafafa">
                <Text fontSize="lg" mt={2} style={{ textAlign: 'center', color: '#404040' }}>
                    <Text bold italic>Collectfy</Text> é um aplicativo para anotações de coletas botânicas em campo. 
                </Text>

                <Center>
                    <Image 
                        alt="app logo"
                        style={{ 
                            width: 170,
                            height: 170,
                        }}
                        source={require('../assets/imgs/app_icon.png')}
                    />
                </Center>

                { firstUseFlag ? 
                <TouchableOpacity
                    style={{
                        borderRadius: 5,
                        backgroundColor: '#f59e0b'
                    }}
                    onPress={() => firstConfiguration() }>
                    <Box px={5} py={3} >
                        <Heading underline size="sm" color="#fafafa">Primeiros passos</Heading>
                        <Text
                            style={{
                                color: '#fafafa',
                                fontSize: 16
                            }}>
                            Toque aqui para acessar as <Text bold>Configurações <Icon as={MaterialCommunityIcons} name="cog" color="#fafafa" size="sm"/></Text> e preencher as informações de <Text italic>Coletor</Text>.
                        </Text>
                    </Box>
                </TouchableOpacity> : null }

                <Button
                    leftIcon={
                        <Icon as={MaterialCommunityIcons} name="leaf" size="md"/>
                    } 
                    size="md" bg="green.500" colorScheme="green" 
                    mt={3} _text={{ fontSize:16 }} style={{ width:'100%' }}
                    onPress={() => props.navigation.navigate('Criar')}>
                    Criar nova Coleta
                </Button>
                <Button 
                    leftIcon={
                        <Icon as={MaterialCommunityIcons} name="tag" size="md"/>
                    }
                    size="md" bg="green.500" colorScheme="green" mt={3} _text={{ fontSize:16 }} style={{ width:'100%' }}
                    onPress={() => props.navigation.navigate('CriarProjeto')}>
                    Criar novo Projeto
                </Button>
                <Button 
                    leftIcon={
                        <Icon as={MaterialCommunityIcons} name="export" size="md"/>
                    }
                    size="md" bg="green.500" colorScheme="green" mt={3} _text={{ fontSize:16 }} style={{ width:'100%' }}
                    onPress={() => props.navigation.navigate('Dados')}>
                    Exportar dados
                </Button>
                <Button 
                    leftIcon={
                        <Icon as={MaterialCommunityIcons} name="cog" size="md"/>
                    }
                    size="md" bg="green.500" colorScheme="green" mt={3} _text={{ fontSize:16 }} style={{ width:'100%' }}
                    onPress={() => props.navigation.navigate('Configuracoes')}>
                    Configurações
                </Button>
                <Button 
                    leftIcon={
                        <Icon as={MaterialCommunityIcons} name="information" size="md"/>
                    }
                    size="md" bg="green.500" colorScheme="green" mt={3} mb={4} _text={{ fontSize:16 }} style={{ width:'100%' }}
                    onPress={() => props.navigation.navigate('Sobre')}>
                    Saiba mais
                </Button>

            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;