import React, {useEffect} from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import FotoService from '../../services/FotoService';
import * as MediaLibrary from 'expo-media-library';


const SobreScreen = (props) => {

    useEffect(async () => {
        let t = await FotoService.findByColeta(1);
        console.log(t)

    }, []);

    return (
        <View style={{flex:1, backgroundColor: '#fff'}}>
            <View style={{ marginVertical: '2%', marginHorizontal: '3%' }}>
                <Text style={{ fontSize:20, fontWeight:'bold', marginBottom: '1%' }}>Sobre</Text>
                <Text style={{ marginVertical: 1, fontSize:16 }}>
                    Texto informativo sobre o aplicativo, objetivo e links para projeto no github e arquivo do TCC ?
                </Text>
            </View>
        </View>
    );
}

export default SobreScreen;

