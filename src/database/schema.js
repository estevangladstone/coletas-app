const coletas = [
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
    `CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    	nome TEXT,
    	valor TEXT
	)`,

    `INSERT INTO configuracoes (nome, valor) values('proximo_numero_coleta', '1');`,
    `INSERT INTO configuracoes (nome, valor) values('nome_coletor', 'Estevan Melo');`
];

export const schema = [ ...coletas, ...configuracoes ];