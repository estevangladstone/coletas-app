import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const TextAreaField = (props) => {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.input_box}>
            <Text style={styles.input_label}>{props.label}</Text>
            { props.helperText &&
            <Text style={styles.input_helper}>{props.helperText}</Text> }
            <TextInput
                style={[
                    styles.input_textarea, 
                    props.isInvalid ? styles.input_field__invalid : null,
                    props.isDisabled ? styles.input_field__disabled : null,
                    isFocused ? styles.input_field__active : null,
                ]}
                placeholder={props.placeholder}
                multiline={true}
                numberOfLines={8}
                value={props.value}
                keyboardType={props.keyboardType}
                onChangeText={(value) => props.setValue(value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!props.isDisabled}
                />

            { props.isInvalid &&
            <Text style={styles.input_error}>{props.errorMessage}</Text> }
        </View>
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
    input_textarea: {
        height: 90,
        borderRadius: 4,
        backgroundColor: '#e5e5e5',
        padding: '2%',
        overflow: 'hidden',
        fontSize: 16,
        color: 'black',
        borderColor: 'transparent',
        borderWidth: 1,
        textAlignVertical: 'top',
    },
    input_field__active: {
        borderColor: 'black',
    },
    input_field__invalid: {
        borderColor: '#ee4343',
    },
    input_field__disabled: {
        backgroundColor: '#f5f5f5',
    },
    input_error_message: {
        color: '#ee4343',
        paddingTop: 7,
        paddingBottom: 7,
    },
});

export default TextAreaField;