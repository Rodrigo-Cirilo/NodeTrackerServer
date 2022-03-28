const {Pool} = require('pg');

const fs = require('fs');


 let dado = JSON.parse(fs.readFileSync('appConfig.json', 'utf-8' ));

const pool = new Pool(dado);

const obj = {pool, dado};

module.exports = obj;

//dado = JSON.parse(data.toString()); 