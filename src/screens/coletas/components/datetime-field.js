import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import { FormControl, Input, Icon, HStack, Pressable } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';


const DatetimeField = (props) => {

    const [maskedDate, setMaskedDate] = useState('');
    const [maskedTime, setMaskedTime] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(props.value instanceof Date) {
            let anoFull = props.value.getFullYear(),
                mes  = (props.value.getMonth()+1).toString(),
                mesFull = (mes.length == 1) ? '0'+mes : mes,
                dia  = props.value.getDate().toString(),
                diaFull = (dia.length == 1) ? '0'+dia : dia;
            setMaskedDate(diaFull+'/'+mesFull+'/'+anoFull);
            
            let hour = props.value.getHours().toString(),
                minutes = props.value.getMinutes().toString();
            let hourFull = (hour.length == 1) ? '0'+hour : hour,
                minutesFull = (minutes.length == 1) ? '0'+minutes : minutes;
            setMaskedTime(hourFull+':'+minutesFull);
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
            <FormControl isInvalid={props.isInvalid} mb="1">
                <HStack space={2}>
                    <Pressable onPress={() => showDatepicker()} w="49%">
                        <FormControl.Label _text={{bold: true, color:'#404040'}} mb="0">Data</FormControl.Label>
                        <Input
                            color='black'
                            isReadOnly
                            style={{
                                backgroundColor: props.isDisabled ? '#f5f5f5' : '#e5e5e5'
                            }}
                            variant="filled"
                            size="lg"
                            value={maskedDate}/>
                    </Pressable>
                    <Pressable onPress={() => showTimepicker()} w="49%">
                        <FormControl.Label _text={{bold: true, color:'#404040'}} mb="0">Hora</FormControl.Label>
                        <Input
                            style={{ 
                                backgroundColor: props.isDisabled ? '#f5f5f5' : '#e5e5e5' 
                            }}
                            color='black'
                            isReadOnly
                            variant="filled"
                            size="lg"
                            value={maskedTime}/>
                    </Pressable>
                </HStack>
                { props.isInvalid &&
                <FormControl.ErrorMessage 
                    _text={{fontSize: 'xs', color: '#ee4343', fontWeight: 500}}>
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

export default DatetimeField;
