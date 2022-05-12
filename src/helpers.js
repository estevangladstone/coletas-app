const formatDate = (date) => {
    let parsedDate = new Date(date),
        dia  = parsedDate.getDate().toString(),
        diaFull = (dia.length == 1) ? '0'+dia : dia,
        mes  = (parsedDate.getMonth()+1).toString(),
        mesFull = (mes.length == 1) ? '0'+mes : mes,
        anoFull = parsedDate.getFullYear();

    return diaFull+mesFull+anoFull;
}

const slugify = (text) => {
  const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeeiiiiooooouuuunc------";

  const newText = text.split('').map(
    (letter, i) => letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i)));

  return newText
    .toString()                     // Cast to string
    .toLowerCase()                  // Convert the string to lowercase letters
    .trim()                         // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-y-')           // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
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

const generatePhotoName = (coletor, numero, index) => {
    let parsedNome = coletor.split(' ')[0]; 

    let parsedNum = numero ? numero : 'SN';

    let parsedDate = new Date(),
        dia  = parsedDate.getDate().toString(),
        diaFull = (dia.length == 1) ? '0'+dia : dia,
        mes  = (parsedDate.getMonth()+1).toString(),
        mesFull = (mes.length == 1) ? '0'+mes : mes,
        anoFull = parsedDate.getFullYear();

    let parsedIndex = String(index).padStart(3, '0')

    return parsedNome+'_'+parsedNum+'_'+diaFull+mesFull+anoFull+'_'+parsedIndex+'.jpg';
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

export { formatDatetime, formatColetaData, generatePhotoName, formatDate, slugify };