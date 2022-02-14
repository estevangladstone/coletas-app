import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TouchableOpacity } from 'react-native';
import { Menu, HamburgerIcon } from 'native-base';

import ListarColetaScreen from './coletas/listar.screen';
import VisualizarColetaScreen from './coletas/visualizar.screen';
import CriarColetaScreen from './coletas/criar.screen';
import CameraScreen from './coletas/camera.screen';
import DadosScreen from './dados/';
import ConfiguracoesScreen from './configuracoes/';
import SobreScreen from './sobre/';

const Stack = createNativeStackNavigator();

const MenuOptions = (props) => {
  	return ( 
		<Menu 
			w="190"
			trigger={(triggerProps) => 
				(<TouchableOpacity 
					style={{ marginLeft: '-10%', paddingRight:'20%' }}
					accessibilityLabel="Menu de navegação" {...triggerProps}>
					<HamburgerIcon size="sm" style={{ color:'white'}}/>
				</TouchableOpacity>)
			}>
			<Menu.Item onPress={() => props.navigation.navigate('Listar')}>Coletas</Menu.Item>
			<Menu.Item onPress={() => props.navigation.navigate('Dados')}>Exportar Dados</Menu.Item>
			<Menu.Item onPress={() => props.navigation.navigate('Configuracoes')}>Configurações</Menu.Item>
			<Menu.Item onPress={() => props.navigation.navigate('Sobre')}>Sobre</Menu.Item>
		</Menu>
	);
}

const NavigationStack = () => {
	return (
	    <Stack.Navigator
	    	screenOptions={{
	    	    headerStyle: {
	    	        backgroundColor: "#22c55e",
	    	    },
	    	    headerTintColor: "white",
	    	    headerBackTitle: "Back",
	    	}}>
	        <Stack.Screen 
	            name="Listar"
	            component={ ListarColetaScreen } 
	            options={(props) => { 
	            	return { 
		            	title:'Coletas',  
			    	    headerLeft: () => <MenuOptions {...props}/>,
			    	}
	            }} />
	        <Stack.Screen 
	            name="Criar" 
	            component={ CriarColetaScreen }
	            options={{ title:'Nova Coleta' }} />
	        <Stack.Screen 
	            name="Visualizar" 
	            component={ VisualizarColetaScreen }
	            options={(props) => {
	             return {title:props.route.params.title}; 
	         	}} />
	        <Stack.Screen 
	            name="Configuracoes" 
	            component={ ConfiguracoesScreen }
	            options={{ title:'Configurações' }} />
	        <Stack.Screen 
	            name="Dados" 
	            component={ DadosScreen }
	            options={{ title:'Exportar Coletas' }} />
	        <Stack.Screen 
	            name="Sobre" 
	            component={ SobreScreen }
	            options={{ title:'Sobre' }} />
	        <Stack.Screen 
	            name="Camera" 
	            component={ CameraScreen }
	            options={{ title:'', headerShown:false }} />
	    </Stack.Navigator>
	);
}

export default NavigationStack;