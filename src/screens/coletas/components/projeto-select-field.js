import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Button, Icon, HStack } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from "@expo/vector-icons";
import ProjetoService from '../../../services/ProjetoService';
import ProjetoModal from '../../projetos/components/projeto-modal';


const ProjetoSelectField = (props) => {

    const [projetos, setProjetos] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [newProjeto, setNewProjeto] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        ProjetoService.findList()
            .then((response) => {
                setProjetos(response);
            })
            .catch(error => {});
    }, []);

    return (
        <>
            <View style={styles.input_box} keyboardShouldPersistTaps='always'>
                <Text style={styles.input_label}>{props.label}</Text>
                
                { props.helperText &&
                <Text style={styles.input_helper}>{props.helperText}</Text> }

                <View style={{flexDirection: 'row' }}>
                    <View style={{borderRadius:3, overflow:'hidden', padding:0, width:'84%'}}>
                        <Picker
                            style={[
                                styles.input_field, 
                                props.isDisabled ? styles.input_field__disabled : null,
                            ]}
                            enabled={!props.isDisabled}
                            selectedValue={props.value}
                            onValueChange={(itemValue) => props.setValue(itemValue)}>
                            <Picker.Item label="Sem projeto" value="" />
                            { newProjeto ? 
                                <Picker.Item label={newProjeto} value={newProjeto} /> : null }
                            {
                                projetos.map((item, index) => { 
                                    return (<Picker.Item label={item.nome} value={item.nome} key={index.toString()} />)
                                })
                            }
                        </Picker>
                    </View>
                    { !props.isDisabled ? 
                        <Button
                            w="13%" size="lg" ml="2" bg="green.500" 
                            onPress={() => setOpenModal(true)} colorScheme="green">
                            <Icon color="white" size="7" as={<MaterialIcons name="add" />} />
                        </Button>
                    : null }
                </View>

                { props.isInvalid &&
                <Text style={styles.input_error_message}>{props.errorMessage}</Text> }
            </View>

            <ProjetoModal 
                openModal={openModal}
                closeModal={() => setOpenModal(false)}
                value={newProjeto}
                setValue={(value) => {
                    setNewProjeto(value);
                    props.setValue(value);
                }}
                projetos={projetos} />
        </>
    );

}

const styles = StyleSheet.create({
    input_box: {
        marginBottom: "1%",
    },
    input_label: {
        fontWeight: 'bold',
        color: '#404040',
        paddingTop: 5,
        paddingBottom: 5,
    },
    input_helper: {
        color: '#737373',
        paddingBottom: 5,
    },
    input_field: {
        borderRadius: 4,
        backgroundColor: '#e5e5e5',
        padding: '2%',
        overflow: 'hidden',
        fontSize: 16,
        color: 'black',
        borderColor: 'transparent',
        borderWidth: 1
    },
    input_field__active: {
        borderColor: 'black',
    },
    input_field__invalid: {
        borderColor: '#ee4343',
    },
    input_field__disabled: {
        opacity: 0.8,
        backgroundColor: '#f5f5f5',
    },
    input_error_message: {
        color: '#ee4343',
        paddingTop: 7,
        paddingBottom: 7,
    },
});

export default ProjetoSelectField;