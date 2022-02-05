import React from 'react';
import { 
    FormControl,
    TextArea,
} from 'native-base';

const ColetaTextAreaField = (props) => {

    return (
        <FormControl isInvalid={props.isInvalid} mb="1" isDisabled={props.isDisabled}>
            <FormControl.Label _text={{bold: true}} mb="0">{props.label}</FormControl.Label>
            { props.helperText &&
            <FormControl.HelperText _text={{fontSize: 'sm', marginBottom: 1}}>
                {props.helperText}
            </FormControl.HelperText> }
            <TextArea 
                h={20}
                variant="filled"
                size="lg"
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={(value) => props.setValue(value)}/>
            { props.isInvalid &&
            <FormControl.ErrorMessage 
                _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                {props.errorMessage}
            </FormControl.ErrorMessage> }
        </FormControl>
    );

}

export default ColetaTextAreaField;