const generateImageName = (coletor, numero) => {
    let now = new Date,
        anoFull = now.getFullYear(),
        mes  = (now.getMonth()+1).toString(),
        mesFull = (mes.length == 1) ? '0'+mes : mes,
        dia  = now.getDate().toString(),
        diaFull = (dia.length == 1) ? '0'+dia : dia,
        hora  = now.getHours().toString(),
        horaFull = (hora.length == 1) ? '0'+hora : hora,
        minutos  = now.getMinutes().toString(),
        minutosFull = (minutos.length == 1) ? '0'+minutos : minutos;
        
    let data = anoFull+'-'+mesFull+'-'+diaFull+'-'+horaFull+'-'+minutosFull+'-'+segundosFull;

    return coletor+'_'+numero+'_'+data+'.jpg';
}

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

export { generateImageName, formatDatetime };