export default class Projeto {

    constructor(id=null, nome=null, descricao=null, created_at=null, 
        updated_at=null)
    {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    
}