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
            .catch(error => console.log(error));
    }, []);

    // const selectItem = (value) => {
    //     props.setValue(value);
    //     setOpenSugestions(false);
    // }

    // const filterProjetos = () => {
    //     if(props.value) {
    //         let filtered = projetos.filter(item => {
    //             return item.nome.includes(props.value)
    //         });
    //         if(filtered.lenght) {
    //             setFilteredProjetos(filtered);
    //         }
    //     } else {
    //         setFilteredProjetos(projetos);
    //     }
    // }

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
                    <Button 
                        w="13%" size="lg" ml="2" colorScheme="green" isDisabled={props.isDisabled}
                        onPress={() => setOpenModal(true)}>
                        <Icon color="white" size="7" as={<MaterialIcons name="add" />} />
                    </Button>
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
        color: 'black',
        paddingTop: 5,
        paddingBottom: 5,
    },
    input_helper: {
        color: '#727272',
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

    // input_box: {
    //     marginBottom: "1%",
    // },
    // input_label: {
    //     fontWeight: 'bold',
    //     color: 'black',
    //     paddingTop: 5,
    //     paddingBottom: 5,
    // },
    // input_helper: {
    //     color: '#727272',
    //     paddingBottom: 5,
    // },
    // input_group: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 4,
    //     backgroundColor: '#e5e5e5',
    //     borderColor: 'transparent',
    //     borderWidth: 1
    // },
    // input_field: {
    //     flex: 1,
    //     padding: '2%',
    //     overflow: 'hidden',
    //     fontSize: 16,
    //     color: 'black',
    // },
    // input_field__invalid: {
    //     borderColor: '#ee4343',
    // },
    // input_field__disabled: {
    //     opacity: 0.8,
    //     backgroundColor: '#f5f5f5',
    // },
    // input_field__active: {
    //     borderColor: 'black',
    // },
    // input_error_message: {
    //     color: '#ee4343',
    //     paddingTop: 7,
    //     paddingBottom: 7,
    // },

    // select_list: {
    //     borderRadius: 4,
    //     borderWidth: 1,
    //     borderColor: '#e5e7eb',
    //     position:'absolute',
    //     width:'100%',
    //     maxHeight:140,
    // },
    // select_item: {
    //     backgroundColor: '#f8f8f8',
    //     padding: '3%',
    //     borderBottomColor: '#e5e7eb',
    //     borderBottomWidth: 1,
    // },
});

export default ProjetoSelectField;

// <View style={{borderRadius:3, overflow:'hidden', padding:0, width:'85%'}}>
//     <Picker
//         style={[
//             styles.input_field, 
//             props.isDisabled ? styles.input_field__disabled : null,
//         ]}
//         enabled={!props.isDisabled}
//         selectedValue={props.value}
//         onValueChange={(itemValue) => props.setValue(itemValue)}>
//         <Picker.Item label="Sem projeto" value="" />
//         {
//             projetos.map((item, index) => { 
//                 return (<Picker.Item label={item.nome} value={item.id} key={index.toString()} />)
//             })
//         }
//     </Picker>
// </View>
// <Button 
//     w="13%" size="lg" ml="2" colorScheme="green" isDisabled={props.isDisabled}
//     onPress={() => setOpenModal(true)}>
//     <Icon color="white" size="7" as={<MaterialIcons name="add" />} />
// </Button>


// <TextInput
//     onLayout={(event) => {
//         let {y, height} = event.nativeEvent.layout                        
//         console.log(y, height)
//         setInputHeight(y + height)
//     }}
//     style={[
//         styles.input_field, 
//         props.isInvalid ? styles.input_field__invalid : null,
//         props.isDisabled ? styles.input_field__disabled : null,
//         isFocused ? styles.input_field__active : null,
//     ]}
//     placeholder={props.placeholder}
//     value={props.value}
//     onChangeText={(value) => console.log(value)}
//     onFocus={() => {setIsFocused(true);setOpenSugestions(true)}}
//     editable={!props.isDisabled}
//     />
// { openSugestions && 
//     <FlatList
//         style={{position:'absolute', width:'100%', maxHeight:140, top:inputHeight}}
//         data={projetos}
//         renderItem={({item}) => (
//             <TouchableOpacity
//                 style={{borderWidth: 1, borderColor:'red', padding:'3%'}}
//                 onPress={() => console.log(item)}>
//                 <Text style={{fontSize:18}}>{item.nome} || {item.id}</Text>
//             </TouchableOpacity>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//     />
// }

{/*<View 
    onLayout={(event) => {
        let {y, height} = event.nativeEvent.layout                        
        setInputHeight(y + height)
    }}
    style={[
        styles.input_group, 
        props.isInvalid ? styles.input_field__invalid : null,
        props.isDisabled ? styles.input_field__disabled : null,
        isFocused ? styles.input_field__active : null,
    ]} >
    <TextInput
        style={styles.input_field}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={(value) => {
            props.setValue(value)
            filterProjetos();
        }}
        onFocus={() => {
            setIsFocused(true);
            setOpenSugestions(true);
        }}
        editable={!props.isDisabled}
    />
    <Icon color="black" size="7" style={{ marginRight: "2%" }} 
        onPress={() => setOpenSugestions(!openSugestions)}
        as={<MaterialIcons name={openSugestions ? "keyboard-arrow-up" : "keyboard-arrow-down"} />} />
</View>

{ openSugestions && 
    <FlatList
        style={[styles.select_list, { top:inputHeight }]}
        data={filteredProjetos}
        renderItem={({item}) => (
            <TouchableOpacity
                style={styles.select_item}
                onPress={() => selectItem(item.nome)}>
                <Text style={{fontSize:18}}>{item.nome}</Text>
            </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
    />
}*/}