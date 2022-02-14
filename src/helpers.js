const formatDatetime = (datetime) => {
	let parsedDate = new Date(datetime),
        dia  = parsedDate.getDate().toString(),
        diaFull = (dia.length == 1) ? '0'+dia : dia,
        mes  = (parsedDate.getMonth()+1).toString(),
        mesFull = (mes.length == 1) ? '0'+mes : mes,
        anoFull = parsedDate.getFullYear(),
        hora  = parsedDate.getHours().toString(),
        horaFull = (hora.length == 1) ? '0'+hora : hora,
        minutos  = parsedDate.getMinutes().toString(),
        minutosFull = (minutos.length == 1) ? '0'+minutos : minutos;

	return diaFull+'/'+mesFull+'/'+anoFull+' às '+horaFull+':'+minutosFull;
}

const formatColetaData = (model) => {
    
    let parsedDate = new Date(model.data_hora),
        dia  = parsedDate.getDate().toString(),
        diaFull = (dia.length == 1) ? '0'+dia : dia,
        mes  = (parsedDate.getMonth()+1).toString(),
        mesFull = (mes.length == 1) ? '0'+mes : mes,
        anoFull = parsedDate.getFullYear(),
        hora  = parsedDate.getHours().toString(),
        horaFull = (hora.length == 1) ? '0'+hora : hora,
        minutos  = parsedDate.getMinutes().toString(),
        minutosFull = (minutos.length == 1) ? '0'+minutos : minutos;

    return {
        "Dia": diaFull,
        "Mês": mesFull,
        "Ano": anoFull,
        "Hora": horaFull+':'+minutosFull,
        "Número de coleta": model.numero_coleta,
        "Coletor principal": model.coletor_principal,
        "Outros coletores": model.outros_coletores,
        "Espécie": model.especie,
        "Família": model.familia,
        "Hábito de Crescimento": model.habito_crescimento,
        "Descrição do espécime": model.descricao_especime,
        "Substrato": model.substrato,
        "Descrição do local": model.descricao_local,
        "Longitude": model.longitude,
        "Latitude": model.latitude,
        "Altitude": model.altitude,
        "País": model.pais,
        "Estado": model.estado,
        "Localidade": model.localidade,
        "Observações": model.observacoes
    }
}

export { formatDatetime, formatColetaData };