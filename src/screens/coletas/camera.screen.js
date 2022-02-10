import React, { useState, useEffect, useRef } from 'react';
import { 
    Alert, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions,
    Plataform, BackHandler, StatusBar
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from "@expo/vector-icons";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import FileService from '../../services/FileService';


const CameraScreen = (props) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.auto);
    const [flashIcon, setFlashIcon] = useState('flash-auto');
    const [openCamera, setOpenCamera] = useState(true);
    const [photo, setPhoto] = useState(null);
    
    const [dimensions, setDimensions] = useState({});
    const [isDimensionsSet, setIsDimensionsSet] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync(false);
            setHasPermission(status === 'granted');
        })();
    }, []);

    const setCameraReady = async () => {
        if (!isDimensionsSet) {
            await prepareDimensions();
        }
    };

    // set the camera size and padding.
    // this code assumes a portrait mode screen
    const prepareDimensions = async () => {
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const { height, width } = Dimensions.get('window');

            setDimensions({
                width: width,
                height: (width*(4/3)),
            });
            setIsDimensionsSet(true);
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

    const changeType = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    }

    const changeFlash = () => {
        if(flash === Camera.Constants.FlashMode['auto']) {
            setFlash(Camera.Constants.FlashMode['off']);
            setFlashIcon('flash-off')
        } else if(flash === Camera.Constants.FlashMode['off']) {
            setFlash(Camera.Constants.FlashMode['on']);
            setFlashIcon('flash-on')
        } else {
            setFlash(Camera.Constants.FlashMode['auto']);
            setFlashIcon('flash-auto')
        }
    }

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
        (
        <View style={styles.mainContainer}>
            <View style={styles.cameraContainer}>
                <Camera
                    onCameraReady={setCameraReady}
                    style={dimensions}
                    ratio={'4:3'}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef} >
                </Camera>
            </View>
            <View style={styles.controlsContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.camera_button}
                        onPress={changeFlash} >
                        <MaterialIcons name={flashIcon} size={40} color="white"/>    
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.camera_button}
                        onPress={takePhoto}>
                        <MaterialIcons name="radio-button-off" size={80} color="white"/>    
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.camera_button}
                        onPress={changeType}>
                        <MaterialIcons name="flip-camera-ios" size={40} color="white"/>    
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        )
        : 
        (<View style={styles.mainContainer}>
            <View style={styles.cameraContainer}>
                <Image 
                    style={dimensions}
                    source={{ uri:photo }} />
            </View>
            <View style={styles.controlsContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.camera_button}
                        onPress={closeCamera}>
                        <MaterialIcons name="close" size={40} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.camera_button}
                        onPress={() => setOpenCamera(true)}>
                        <MaterialIcons name="replay" size={80} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.camera_button}
                        onPress={async () => {
                            //props.savePhoto(photo);
                            await savePhoto();
                            closeCamera();
                        }}>
                        <MaterialIcons name="check" size={40} color="white"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        );

}

const styles = StyleSheet.create({
    mainContainer: {
        flex:1, 
        backgroundColor:'#262626',
        paddingTop: StatusBar.currentHeight
    },
    cameraContainer: {
        flex:1, 
        flexDirection: 'column-reverse'
    },
    controlsContainer: {
        backgroundColor: 'transparent', 
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end'
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