import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Menu, Pressable, HamburgerIcon, Box, Spacer } from 'native-base';

import ListarColetaScreen from './coletas/listar.screen';
import EditarColetaScreen from './coletas/editar.screen';
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
				(<Pressable 
					mr="8"
					accessibilityLabel="Menu de navegação" {...triggerProps}>
					<HamburgerIcon size="sm" style={{ color:'white'}}/>
				</Pressable>)
			}>
			<Menu.Item onPress={() => props.navigation.navigate('Listar')}>Coletas</Menu.Item>
			{/*<Menu.Item onPress={() => props.navigation.navigate('Projetos')}>Projetos</Menu.Item>*/}
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
	            name="Editar" 
	            component={ EditarColetaScreen }
	            options={{ title:'Editar Coleta' }} />
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
	        {/*<Stack.Screen 
	            name="Projetos" 
	            component={ ListarProjetosScreen }
	            options={{ title:'Projetos' }} />*/}
	    </Stack.Navigator>
	);
}

export default NavigationStack;