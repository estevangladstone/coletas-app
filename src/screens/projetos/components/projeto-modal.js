import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Modal, Button } from 'native-base';
import TextField from '../../coletas/components/text-field';


const ProjetoModal = (props) => {

    const [name, setName] = useState();
    const [error, setError] = useState(false);

    const onChange = (value) => {
        setName(value);
        setError(false);
    }

    const onSubmit = () => {
        if(!validate()) {
            setError(true);
            return;
        }
        props.setValue(name);
        props.closeModal();
    }

    const validate = () => {
        if(name == '') {
            return false;
        }
        let existingName = props.projetos.find((item) => {
            return item.nome === name;
        });
        if(existingName != null) {
            return false;
        }
        return true;
    }

    return (
        <Modal size="xl" isOpen={props.openModal} onClose={props.closeModal}>
            <Modal.Content>
                <Modal.Body> 
                    <TextField 
                        label="Novo Projeto"
                        value={name}
                        setValue={(value) => onChange(value)}
                        isInvalid={error}
                        errorMessage={"Nome inválido ou já existe projeto com esse nome."} />
                </Modal.Body> 
                <Modal.Footer style={{ backgroundColor: 'transparent' }}>
                    <Button 
                        flex={1}
                        size="md"
                        _text={{ fontSize:16 }}
                        variant="subtle" 
                        colorScheme="muted" 
                        onPress={() => props.closeModal()}>
                        Cancelar
                    </Button>
                    <Button 
                        flex={1}
                        size="md"
                        _text={{ fontSize:16 }}
                        bg="green.500" colorScheme="green" 
                        onPress={onSubmit}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

export default ProjetoModal;