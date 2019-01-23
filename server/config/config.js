// =====================
// puerto commit
// =====================

port = process.env.PORT || 3000;

// =====================
// enviroment  
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 

// =====================
// database 
// =====================
let urlDB;

if ( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
} else {    
    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;

// =====================
// autenticacion
// =====================

// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.TOKEN_EXPIRES = '1d';

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'semilla-token-desarrollo';

// =====================
// google client id
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1090281478168-pbkmmvq86s118pedcvh94gare85qqman.apps.googleusercontent.com'; 