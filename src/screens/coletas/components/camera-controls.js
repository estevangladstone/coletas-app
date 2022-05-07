import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { FlatList, HStack, Icon } from 'native-base';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PhotoModal from './photo-modal';
import FileService from '../../../services/FileService';


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

    const deletePhoto = async (photoUri) => {
        if(props.isDisabled) { return null; }
        await FileService.deleteTempFile(photoUri);
        props.removePhoto(photoUri);
    }

    return (
        <HStack mb="1">
            { props.isDisabled ? null :
            <TouchableOpacity 
                style={{
                    backgroundColor:'#e5e5e5',
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
                    color="#404040"
                />
            </TouchableOpacity> }
            <FlatList
                horizontal={true}
                style={{ marginLeft: 2 }}
                data={props.photos}
                renderItem={({item, index}) => (
                    <TouchableOpacity onPress={() => showPhotoModal(item)}>
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
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            >
            </FlatList>
            <PhotoModal 
                photo={selectedPhoto}
                openModal={showModal}
                closeModal={closePhotoModal}
                isDisabled={props.isDisabled}
                removePhoto={async () => await deletePhoto(selectedPhoto)} />
        </HStack>
    );
}

export default CameraControls;