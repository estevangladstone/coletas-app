import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { 
    Box, Spinner, Heading
} from 'native-base';


const LoadingOverlay = () => {

    const [window, setWindow] = useState(Dimensions.get('window'));

    return (
        <Box 
            style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0.5,
                backgroundColor: 'white',
                width: window.width,
                height: window.height,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3, // works on ios
                elevation: 3, // works on android  
            }} >
            <Spinner color="green.500" accessibilityLabel="Carregando" size="lg"/>
            <Heading color="green.500" fontSize="lg">
                Carregando
            </Heading>
        </Box>
    );
}

export default LoadingOverlay;