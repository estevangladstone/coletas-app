import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';


const LoadingOverlay = ({item}) => {
    return (
    	<View style={{
    			position: 'absolute',
			    left: 0,
			    right: 0,
			    top: 0,
			    bottom: 0,
			    alignItems: 'center',
			    justifyContent: 'center',
			    backgroundColor: '#73737377'
    		}}>
    		<View style={{
    				alignItems: 'center',
    				flexDirection: 'row',
    				backgroundColor: 'white',
    				padding: 15,
    				borderRadius: 3
    			}}>
				<ActivityIndicator size="large" color="#22c55e"/>
				<Text style={{
						marginLeft: 7,
						fontSize: 20,
						color: '#22c55e'
					}}>
					Carregando...
				</Text>
    		</View>
    	</View>
    );
}

export default LoadingOverlay;