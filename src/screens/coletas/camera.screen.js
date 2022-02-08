import React, { useState, useEffect, useRef } from 'react';
import { 
    Alert, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions,
    Plataform, BackHandler
} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from "@expo/vector-icons";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import FileService from '../../services/FileService';


const CameraScreen = (props) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [openCamera, setOpenCamera] = useState(true);
    const [photo, setPhoto] = useState(null);
    
    const [ratio, setRatio] = useState(null);
    const [isRatioSet, setIsRatioSet] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
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
            const { height, width } = Dimensions.get('window');
            const screenRatio = height / width;

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
            setRatio(desiredRatio);
            // Set a flag so we don't do this 
            // calculation each time the screen refreshes
            setIsRatioSet(true);
        }
    };

    const takePhoto = async () => {
        if(cameraRef) {
            try {
                let pic = await cameraRef.current.takePictureAsync({
                    skipProcessing: true,
                    allowEditing: true,
                    aspect: [4, 3],
                    quality: 1
                });

                if(!pic.cancelled) {
                    if (type === Camera.Constants.Type.front) {
                        pic = await manipulateAsync(
                            pic.localUri || pic.uri,
                            [{ rotate: 180 }, { flip: FlipType.Vertical },],
                            { compress: 1, format: SaveFormat.JPEG }
                        );
                    }
                    setPhoto(pic.uri);
                    setOpenCamera(false);
                }
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

    const savePhoto = async () => {
        await FileService.saveInTemp(photo);
    }

    const closeCamera = () => {
        props.navigation.goBack();
    }

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>Sem permissão de acesso a câmera.</Text>;
    }
    return openCamera ? 
        (<Camera
            onCameraReady={setCameraReady}
            style={{flex:1}}
            ratio={'4:3'}
            type={type}
            ref={cameraRef} >
            <View style={styles.controlsContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.camera_button}
                        onPress={closeCamera} >
                        <MaterialIcons name="close" size={50} color="white"/>    
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.camera_button}
                        onPress={takePhoto}>
                        <MaterialIcons name="radio-button-off" size={85} color="white"/>    
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.camera_button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <MaterialIcons name="flip-camera-ios" size={50} color="white"/>    
                    </TouchableOpacity>
                </View>
            </View>
        </Camera>)
        : 
        (<View flex={1} style={{ justifyContent:"center" }}>
            <ImageBackground 
                style={styles.photo_preview}
                source={{ uri:photo }}
                >
                <View style={styles.controlsContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.camera_button}
                            onPress={closeCamera}>
                            <MaterialIcons name="close" size={50} color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.camera_button}
                            onPress={() => setOpenCamera(true)}>
                            <MaterialIcons name="redo" size={75} color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.camera_button}
                            onPress={async () => {
                                //props.savePhoto(photo);
                                await savePhoto();
                                closeCamera();
                            }}>
                            <MaterialIcons name="check" size={50} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
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