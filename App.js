import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { SSRProvider } from '@react-aria/ssr'; 
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './src/screens';
import { DatabaseInit } from './src/database/DatabaseInit';


export default function App() {

    useEffect(() => {
        DatabaseInit();
    }, []);

    return (
        <SSRProvider>
            <NavigationContainer>
                <NativeBaseProvider>
                    <SafeAreaView flex={1}>
                        <NavigationStack />
                    </SafeAreaView>
                </NativeBaseProvider>
                <StatusBar style="light" />
            </NavigationContainer>
        </SSRProvider>
    );

}
