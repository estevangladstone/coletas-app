import React, { useState, useEffect } from 'react';
import {View, Button, Platform, Text} from 'react-native';
import { 
    FormControl,
    Input,
    Icon,
    HStack,
    Pressable,
} from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

const ColetaDatetimeField = (props) => {

    const [maskedDate, setMaskedDate] = useState('');
    const [maskedTime, setMaskedTime] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(props.value instanceof Date) {
            setMaskedDate(props.value.toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
            setMaskedTime(props.value.toLocaleTimeString('pt-BR', {timeZone: 'UTC'}));
        }
    }, [props.value]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || props.value;
        setShow(Platform.OS === 'ios');
        props.setValue(currentDate);
    };

    const showMode = (currentMode) => {
        if(!props.isDisabled) {
            setMode(currentMode);
            setShow(true);
        }
    };

    const showDatepicker = () => {
        showMode('date');
    }; 

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View>
            <FormControl isInvalid={props.isInvalid} mb="1" isDisabled={props.isDisabled}>
                <HStack space={2}>
                    <Pressable onPress={() => showDatepicker()} w="49%">
                        <FormControl.Label _text={{bold: true}} mb="0">Data</FormControl.Label>
                        <Input
                            isReadOnly
                            variant="filled"
                            size="lg"
                            value={maskedDate}/>
                    </Pressable>
                    <Pressable onPress={() => showTimepicker()} w="49%">
                        <FormControl.Label _text={{bold: true}} mb="0">Hora</FormControl.Label>
                        <Input
                            isReadOnly
                            variant="filled"
                            size="lg"
                            value={maskedTime}/>
                    </Pressable>
                </HStack>
                { props.isInvalid &&
                <FormControl.ErrorMessage 
                    _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                    {props.errorMessage}
                </FormControl.ErrorMessage> }
            </FormControl>

            {show && (
            <DateTimePicker
                value={props.value}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}/>
            )}
        </View>
    );
}

export default ColetaDatetimeField;
