import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Icon } from 'native-base';
import * as Location from 'expo-location';
import { MaterialIcons } from "@expo/vector-icons";


const LocationControls = (props) => {

    const [buttonLoading, setButtonLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({});

    const getLocationData = () => {
        setButtonLoading(true);
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                try {
                    let currLocation = await Location.getCurrentPositionAsync(
                        { accuracy: Location.Accuracy.Highest });

                    props.setLocationData({
                        latitude: currLocation.coords.latitude.toString(),
                        longitude: currLocation.coords.longitude.toString(),
                        altitude: currLocation.coords.altitude.toString()
                    })
                    setButtonLoading(false);
                } catch(e) {
                    setButtonLoading(false);
                    Alert.alert(
                        "Erro",
                        "Não foi possível obter a Localização. Confira se o GPS está LIGADO e tente novamente.",
                        [{
                            text: "OK",
                            style: "default",
                        }],
                        { cancelable: true }
                    );
                }
            } else {
                setButtonLoading(false);
                Alert.alert(
                    "Erro",
                    "A permissão para acesso a Localização não foi concedida.",
                    [{
                        text: "OK",
                        style: "default",
                    }],
                    { cancelable: true }
                );
            }
        })();
    }

    return (
    	<Button
            w="13%" h="50" size="lg" ml="2" mt="5"
            isLoading={buttonLoading}
            _spinner={{
                color: "white"
            }}
            _loading={{
                bg: 'green'
            }}
            bg="green.500" colorScheme="green"
            onPress={getLocationData}
            isDisabled={props.isDisabled}>
            { !buttonLoading &&
            <Icon
                color="white"
                as={<MaterialIcons name="my-location" />}
                size="7"
            /> }
        </Button>
    );

}

export default LocationControls;