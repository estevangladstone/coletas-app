import React from 'react';
import { SafeAreaView } from 'react-native';
import { SSRProvider } from '@react-aria/ssr'; 
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './src/screens';


export default function App() {

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
