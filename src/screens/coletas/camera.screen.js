import React, { useState, useEffect, useRef } from 'react';
import { 
    Alert, StyleSheet, Text, ImageBackground, Dimensions, Plataform, BackHandler
} from 'react-native';
import { Button, IconButton, Box } from 'native-base';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from "@expo/vector-icons";


const CameraScreen = (props) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [openCamera, setOpenCamera] = useState(true);
    const [photo, setPhoto] = useState(null);
    
    const [ratio, setRatio] = useState(null);
    const [isRatioSet, setIsRatioSet] = useState(false);
    const { height, width } = Dimensions.get('window');
    const screenRatio = height / width;
    const [imagePadding, setImagePadding] = useState(0);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio();
        }
    };

    // set the camera ratio and padding.
    // this code assumes a portrait mode screen
    const prepareRatio = async () => {
        let desiredRatio = '4:3';  // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await cameraRef.current.getSupportedRatiosAsync();

            // Calculate the width/height of each of the supported camera ratios
            // These width/height are measured in landscape mode
            // find the ratio that is closest to the screen ratio without going over
            let distances = {};
            let realRatios = {};
            let minDistance = null;
            for (const ratio of ratios) {
                const parts = ratio.split(':');
                const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
                realRatios[ratio] = realRatio;
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio; 
                distances[ratio] = realRatio;
                if (minDistance == null) {
                    minDistance = ratio;
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio;
                    }
                }
            }
            // set the best match
            desiredRatio = minDistance;
            //  calculate the difference between the camera width and the screen height
            const remainder = Math.floor(
                (height - realRatios[desiredRatio] * width) / 2
            );
            // set the preview padding and preview ratio
            setImagePadding(remainder);
            setRatio(desiredRatio);
            // Set a flag so we don't do this 
            // calculation each time the screen refreshes
            setIsRatioSet(true);
        }
    };

    const takePhoto = async () => {
        if(cameraRef) {
            try {
                let photo = await cameraRef.current.takePictureAsync({
                    skipProcessing: true,
                    allowEditing: true,
                    aspect: [4, 3],
                    quality: 1
                });
                return photo;
            } catch(e) {
                Alert.alert(
                    "Erro",
                    "Não foi possível fazer a captura de foto.",
                    [{text: "OK", style: "default"}],
                    { cancelable: true }
                );
            }
        }
    };

    if (hasPermission === null) {
        return <Box />;
    }
    if (hasPermission === false) {
        return <Text>Sem permissão de acesso a câmera.</Text>;
    }
    return openCamera ? 
        (<Camera
            onCameraReady={setCameraReady}
            style={{flex:1}}
            ratio={ratio}
            type={type}
            ref={cameraRef} >
            <Box style={styles.controlsContainer}>
                <Box style={styles.buttonContainer}>
                    <IconButton 
                        size="12"
                        borderRadius="full"
                        colorScheme="indigo"
                        style={styles.camera_button}
                        onPress={() => props.closeCamera()}
                        _icon={{
                            as: MaterialIcons,
                            name: "close",
                            size:12,
                            color:'white'
                        }} />
                    <IconButton 
                        size="20"
                        borderRadius="full"
                        colorScheme="error"
                        style={styles.camera_button}
                        onPress={async () => {
                            const r = await takePhoto();
                            if(!r.cancelled) {
                                setPhoto(r.uri);
                                setOpenCamera(false);
                            }
                        }}
                        _icon={{
                            as: MaterialIcons,
                            name: "radio-button-off",
                            size:20,
                            color:'white'
                        }}
                         />
                    <IconButton 
                        size="12"
                        borderRadius="full"
                        colorScheme="indigo"
                        style={styles.camera_button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}
                        _icon={{
                            as: MaterialIcons,
                            name: "flip-camera-ios",
                            size:12,
                            color:'white',
                        }} />
                </Box>
            </Box>
        </Camera>)
        : 
        (<Box flex={1} justifyContent="center">
            <ImageBackground 
                style={styles.photo_preview}
                source={{ uri:photo }}
                >
                <Box style={styles.controlsContainer}>
                    <Box style={styles.buttonContainer}>
                        <IconButton 
                            size="12"
                            borderRadius="full"
                            colorScheme="indigo"
                            style={styles.camera_button}
                            onPress={() => props.closeCamera()}
                            _icon={{
                                as: MaterialIcons,
                                name: "close",
                                size:12,
                                color:'white'
                            }} />
                        <IconButton 
                            size="16"
                            borderRadius="full"
                            colorScheme="error"
                            style={styles.camera_button}
                            onPress={() => setOpenCamera(true)}
                            _icon={{
                                as: MaterialIcons,
                                name: "redo",
                                size:16,
                                color:'white'
                            }}
                             />
                        <IconButton 
                            size="12"
                            borderRadius="full"
                            colorScheme="indigo"
                            style={styles.camera_button}
                            onPress={() => {
                                props.savePhoto(photo);
                                props.closeCamera();
                            }}
                            _icon={{
                                as: MaterialIcons,
                                name: "check",
                                size:12,
                                color:'white',
                            }} />
                    </Box>
                </Box>
            </ImageBackground>
        </Box>
        );

}

const styles = StyleSheet.create({
    controlsContainer: {
        flex: 1, 
        backgroundColor: 'transparent', 
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end', 
        paddingBottom: '2%'
    },
    buttonContainer: { 
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        alignSelf:'flex-end',
    },
    camera_button: { 
        margin: '5%',
    },
    buttonText: { 
        color:'white',
        fontWeight: 'bold'    
    },
    photo_preview: {
        flex:1,
        justifyContent: 'center'
    },
    cameraPreview: {
        flex:1,
        backgroundColor: 'black'
    }
});

export default CameraScreen;