import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { TouchableOpacity, Text } from 'react-native';
import { Menu, HamburgerIcon } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from './home.screen';
import ListarColetaScreen from './coletas/listar.screen';
import VisualizarColetaScreen from './coletas/visualizar.screen';
import EditarColetaScreen from './coletas/editar.screen';
import CriarColetaScreen from './coletas/criar.screen';
import CameraScreen from './coletas/camera.screen';
import ConfiguracoesScreen from './configuracoes/';
import ListarProjetoScreen from './projetos/listar.screen';
import CriarProjetoScreen from './projetos/criar.screen';
import EditarProjetoScreen from './projetos/editar.screen';
import VisualizarProjetoScreen from './projetos/visualizar.screen';
import DadosScreen from './dados/';
import SobreScreen from './sobre/';


const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const NavigationTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
			    tabBarStyle: {
			        backgroundColor: "#22c55e",
			        marginTop: -7
			    },
			    tabBarLabelStyle: {
			    	fontSize: 15,
			    	fontWeight: "bold"
			    },
			    tabBarIndicatorStyle: { backgroundColor: "#fafafa"},
			    tabBarActiveTintColor: "#fafafa",
			    tabBarInactiveTintColor: "#fafafabf"
			}}>
			<Tab.Screen 
				name="Home"
				component={ HomeScreen }
				options={{
		    	 	tabBarIcon: ({ focused, color }) => {
						return <MaterialIcons name="home" size={25} color={color} />;
			        },
			        tabBarShowLabel: false
				}}/>
			<Tab.Screen name="Coletas" component={ ListarColetaScreen } />
			<Tab.Screen name="Projetos" component={ ListarProjetoScreen } />
		</Tab.Navigator>
	);
}

const NavigationStack = () => {
	return (
	    <Stack.Navigator
	    	screenOptions={{
	    	    headerStyle: {
	    	        backgroundColor: "#22c55e",
	    	    },
	    	    headerTintColor: "#fafafa",
	    	    headerBackTitle: "Back",
	    	}}>
	        <Stack.Screen 
	            name="HomeTabs" 
	            component={ NavigationTabs }
	            options={(props) => { 
	            	return {
	    				headerShadowVisible: false, 
		            	title:'Coletas+',  
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
	            name="Editar" 
	            component={ EditarColetaScreen }
	            options={(props) => {
	            	return {title:props.route.params.title}; 
	         	}} />
	        <Stack.Screen 
	            name="Camera" 
	            component={ CameraScreen }
	            options={{ title:'', headerShown:false }} />
	        <Stack.Screen 
	            name="CriarProjeto" 
	            component={ CriarProjetoScreen }
	            options={{ title:'Novo Projeto' }} />
	        <Stack.Screen 
	            name="EditarProjeto" 
	            component={ EditarProjetoScreen }
	            options={{ title:'Editar Projeto' }} />
	        <Stack.Screen 
	            name="VisualizarProjeto" 
	            component={ VisualizarProjetoScreen }
	            options={{ title:'Projeto' }} />
	        <Stack.Screen 
	            name="Dados" 
	            component={ DadosScreen }
	            options={{ title:'Exportar Coletas' }} />
	        <Stack.Screen 
	            name="Configuracoes" 
	            component={ ConfiguracoesScreen }
	            options={{ title:'Configurações' }} />
	        <Stack.Screen 
	            name="Sobre" 
	            component={ SobreScreen }
	            options={{ title:'Sobre' }} />
	    </Stack.Navigator>
	);
}

export default NavigationStack;