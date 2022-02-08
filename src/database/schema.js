const coletas = [
    `DROP TABLE coletas`,

    `CREATE TABLE IF NOT EXISTS coletas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    	data_hora TEXT,
    	numero_coleta INTEGER UNIQUE,
    	coletores TEXT,
    	especie TEXT,
    	familia TEXT,
    	habito_crescimento TEXT,
    	descricao_especime TEXT,
    	substrato TEXT,
    	descricao_local TEXT,
    	latitude REAL,
    	longitude REAL,
    	altitude REAL,
    	pais TEXT,
    	estado TEXT,
    	localidade TEXT,
    	observacoes TEXT,
    	thumbnail TEXT
    );`
];

const configuracoes = [
    `DROP TABLE configuracoes`,

    `CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    	nome TEXT,
    	valor TEXT
	)`,
];

const fotos = [
    `DROP TABLE fotos`,
   
    `CREATE TABLE IF NOT EXISTS fotos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT,
        asset_id TEXT,
        coleta_id INTEGER,
        foreign key (coleta_id) references coletas (id)
    )`,
];

export const schema = [ ...coletas, ...configuracoes, ...fotos ];