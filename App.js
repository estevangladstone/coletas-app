import React, { useEffect } from 'react';
import {SSRProvider} from '@react-aria/ssr'; 
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from './src/screens';
import DatabaseInit from './src/database/DatabaseInit';

export default function App() {
    
    useEffect(() => {
        new DatabaseInit()
        console.log("initialize database")
    }, []);

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
