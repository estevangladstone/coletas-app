const coletas = [
    // `DROP TABLE IF EXISTS coletas`,

    `CREATE TABLE IF NOT EXISTS coletas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    	data_hora TEXT,
    	numero_coleta INTEGER UNIQUE,
        coletor_principal TEXT,
        outros_coletores TEXT,
    	especie TEXT,
    	familia TEXT,
    	habito_crescimento TEXT,
    	descricao_especime TEXT,
    	substrato TEXT,
    	descricao_local TEXT,
    	latitude TEXT,
    	longitude TEXT,
    	altitude TEXT,
    	pais TEXT,
    	estado TEXT,
    	localidade TEXT,
    	observacoes TEXT,
    	thumbnail TEXT
    );`
];

const configuracoes = [
    // `DROP TABLE IF EXISTS configuracoes`,

    `CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    	nome TEXT,
    	valor TEXT
	);`,
];

const fotos = [
    // `DROP TABLE IF EXISTS fotos`,
   
    `CREATE TABLE IF NOT EXISTS fotos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT,
        asset_id TEXT,
        coleta_id INTEGER,
        foreign key (coleta_id) references coletas (id)
    );`,
];

const projetos = [
    // `DROP TABLE IF EXISTS projetos`,
    
    `CREATE TABLE IF NOT EXISTS projetos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        descricao TEXT,
        created_at TEXT,
        updated_at TEXT
    );`,

    // `DROP TABLE IF EXISTS projeto_coleta`,
    
    `CREATE TABLE IF NOT EXISTS projeto_coleta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projeto_id INTEGER,
        coleta_id INTEGER,
        foreign key (projeto_id) references projetos (id),
        foreign key (coleta_id) references coletas (id)
    );`,  
];

export const schema = [ ...coletas, ...configuracoes, ...fotos, ...projetos ];