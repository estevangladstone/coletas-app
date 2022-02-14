import { View, Text } from 'react-native';


const SobreScreen = (props) => {

    return (
        <View style={{flex:1, backgroundColor: '#fafafa'}}>
            <View style={{ marginVertical: '2%', marginHorizontal: '3%' }}>
                <Text style={{ fontSize:20, fontWeight:'bold', marginBottom: '1%' }}>Sobre</Text>
                <Text style={{ marginVertical: 1, fontSize:16 }}>
                    Este aplicativo foi desenvolvido como parte do Trabalho de Conclusão de Curso do Bacharelado em Ciência da Computação da UFRJ.
                </Text>
                <Text style={{ marginVertical: 1, fontSize:16 }}>
                    Para mais informações sobre o trabalho e acesso ao texto, acesse [link da ufrj]
                </Text>
            </View>
        </View>
    );
}

export default SobreScreen;

