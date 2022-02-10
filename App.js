import React from 'react';
import {SSRProvider} from '@react-aria/ssr'; 
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './src/screens';


export default function App() {

    return (
        <SSRProvider>
            <NavigationContainer>
                <NativeBaseProvider>
                    <Box flex={1}>
                        <NavigationStack />
                    </Box>
                </NativeBaseProvider>
                <StatusBar style="light" />
            </NavigationContainer>
        </SSRProvider>
    );

}
