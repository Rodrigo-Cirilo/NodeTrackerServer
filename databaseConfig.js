const {Pool} = require('pg');
const cryptojs = require('crypto-js');

const fs = require('fs');

 let dado = JSON.parse(fs.readFileSync('appConfig.json', 'utf-8' ));

 dado.user = cryptojs.AES.decrypt(dado.user, 'chave secreta: G30d@d0$').toString(cryptojs.enc.Utf8);
 dado.host = cryptojs.AES.decrypt(dado.host, 'chave secreta: G30d@d0$').toString(cryptojs.enc.Utf8);
 dado.database = cryptojs.AES.decrypt(dado.database, 'chave secreta: G30d@d0$').toString(cryptojs.enc.Utf8);
 dado.password = cryptojs.AES.decrypt(dado.password, 'chave secreta: G30d@d0$').toString(cryptojs.enc.Utf8);
 dado.port = parseInt(cryptojs.AES.decrypt(dado.port, 'chave secreta: G30d@d0$').toString(cryptojs.enc.Utf8));
 

 //console.log(dado);

const pool = new Pool(dado);

const obj = {pool, dado};

module.exports = obj;

//dado = JSON.parse(data.toString()); 



// {
//   "user": "postgres",
//   "host": "srv-dev",
//   "database": "Rastreador",
//   "password": "geodados",  
//   "port": 5432,
//   "serverPort": 8080
// }