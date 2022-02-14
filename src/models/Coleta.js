export default class Coleta {

    constructor(id=null, data_hora=null, coletor_principal=null, outros_coletores=null, 
        numero_coleta=null, especie=null, familia=null, habito_crescimento=null,
        descricao_especime=null, substrato=null, descricao_local=null, latitude=null,
        longitude=null, altitude=null, pais=null, estado=null, localidade=null,
        observacoes=null, thumbnail=null)
    {
        this.id = id;
        this.data_hora = data_hora;
        this.numero_coleta = numero_coleta;
        this.coletor_principal = coletor_principal;
        this.outros_coletores = outros_coletores;
        this.especie = especie;
        this.familia = familia;
        this.habito_crescimento = habito_crescimento;
        this.descricao_especime = descricao_especime;
        this.substrato = substrato;
        this.descricao_local = descricao_local;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.pais = pais;
        this.estado = estado;
        this.localidade = localidade;
        this.observacoes = observacoes;
        this.thumbnail = thumbnail;
    }
    
}