import React, { useState, useEffect } from 'react';
import { Image, Alert } from 'react-native';
import { Modal, Button, Center } from 'native-base';


const PhotoModal = (props) => {

    const [imageStyles, setImageStyles] = useState({});
    const [maxWidth, setMaxWidth] = useState(null);

	useEffect(() => {
	    if(maxWidth && props.photo) {
	        Image.getSize(props.photo, (width, height) => {
	        	var ratio = maxWidth / width;
	            setImageStyles({ 
	            	width: parseInt(width*ratio),
	            	height: parseInt(height*ratio)
	            });
	        });
	    }
	}, [maxWidth, props.photo]);

    return (
		<Modal size="xl" isOpen={props.openModal} onClose={() => props.closeModal()}>
			<Modal.Content>
                <Modal.Body 
                	style={{flexDirection:'row'}}
                	px="1"
                	onLayout={(e) => setMaxWidth(e.nativeEvent.layout.width * 0.95)}
            	>
					{ props.photo &&
                    <Image 
                    	alt="l" 
                    	style={[{flex: 1, flexWrap: "wrap"}, imageStyles]}
                    	resizeMode="contain"
                    	source={{uri:props.photo}}/>
                    }
				</Modal.Body>
				<Modal.Footer>
					<Button.Group>
						<Button 
						    variant="ghost" 
						    colorScheme="blueGray" 
						    onPress={() => props.closeModal()}>
						    Voltar
						</Button>
						<Button 
							colorScheme="danger" 
							onPress={() => {
								Alert.alert(
								    "Atenção",
								    "Deseja mesmo remover a foto?",
								    [
								        { text: "NÃO", style: "cancel" },
								        { text: "SIM", onPress: () => {
											props.removePhoto();
											props.closeModal();
								        }, style: "destructive" },
								    ],
								    { cancelable: true }
								);
							}}>
							Remover
						</Button>
					</Button.Group>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
    );

}

export default PhotoModal;