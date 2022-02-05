import React, { useState } from 'react';
import { Image } from 'react-native';
import { 
    FlatList, 
    HStack,
    Pressable,
    Icon
} from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PhotoModal from './photo-modal';

const CameraControls = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const showPhotoModal = (photo) => {
        setSelectedPhoto(photo);
        setShowModal(true);
    }

    const closePhotoModal = () => {
        setShowModal(false);
    }

    return (
        <HStack mb="1">
            { props.isDisabled ? null :
            <Pressable 
                backgroundColor='muted.200'
                style={{
                    width: 100, 
                    height: 100, 
                    margin: 2,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center'  
                }}
                onPress={() => props.openCamera()}>
                <Icon
                    as={<MaterialCommunityIcons name="camera-plus" />}
                    size="10"
                />
            </Pressable> }
            <FlatList
                horizontal={true}
                style={{ marginLeft: 2 }}
                data={props.photos}
                renderItem={({item, index}) => (
                    <Pressable onPress={() => {props.isDisabled ? null : showPhotoModal(item)}}>
                        <Image 
                            alt={'fotografia '+index.toString()}
                            style={{ 
                                width:100, 
                                height:100, 
                                borderRadius: 5,
                                margin: 2 
                            }}
                            source={{ uri:item }}>
                        </Image>
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            >
            </FlatList>
            <PhotoModal 
                photo={selectedPhoto}
                openModal={showModal} 
                closeModal={() => closePhotoModal()} 
                removePhoto={() => props.removePhoto(selectedPhoto)}/>
        </HStack>
    );
}

export default CameraControls;