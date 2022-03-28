
const net = require('net');
const server = net.createServer();

const pool = require('./databaseConfig').pool;

const PORT = require('./databaseConfig').dado.serverPort;


//var ip = require("ip"); ip.address(),

const addZero = require('./addZero');




const querySaveData = "INSERT INTO rastreador_v2 (equipamento_id, latitude, longitude, date_time, velocidade) VALUES ($1, $2, $3, $4, $5)";

const querySaveState = "INSERT INTO rastreador_v2_states (equipamento_id, goffstate, turnoffstate, lowbatterystate) VALUES ($1, $2, $3, $4)";

const queryUpdategOff = "UPDATE rastreador_v2_states SET goffstate = $1 WHERE equipamento_id = $2";

const queryUpdateTurnOff = "UPDATE rastreador_v2_states SET turnoffstate = $1 WHERE equipamento_id = $2";

const queryUpdateTurnOffandGoff = "UPDATE rastreador_v2_states SET turnoffstate = $1, goffstate = $2 WHERE equipamento_id = $3";

const queryUpdateLowBattery = "UPDATE rastreador_v2_states SET lowbatterystate = $1 WHERE equipamento_id = $2";

const queryGetId = "SELECT equipamento_id FROM rastreador_v2_states WHERE equipamento_id = ($1)"


///////start server////////      
server.listen(PORT, () => {
    console.log('Server is running');

});

server.on('connection', (socket) => {

    console.log('Rastreador conectou');

    setTimeout(() => {
        socket.write("CONECTOU");
    }, 250); 

    socket.on('close', () => {
        console.log("Rastreador perdeu sinal ? ?");
    })

    socket.on('error', (err) => {
        console.log(`Esse é o erro => ${err}`);
    })


    socket.on('data', (data) => {

        if (data.toString().includes("G_OFF")) {

            pool.query(queryGetId, [data.toString().substring(0, 4)])
                .then((response) => {

                    if (response.rowCount == 0) 
                    {
                        pool.query(querySaveState, [data.toString().substring(0, 4), 1, 0, 0]);
                    }
                    else { 
                        pool.query(queryUpdategOff, [1, data.toString().substring(0, 4)]);   
                    }

                    setTimeout(() => {
                        socket.write("RE1"); 
                    }, 30);

                })
                .catch((err) => {

                    console.log(err);
                    console.log("tive esse erro");
                })


        }
        else if (data.toString().includes("TURN_OFF")) {
           
            console.log('..........');
            pool.query(queryGetId, [data.toString().substring(0, 4)])
                .then((response) => {

                    if (response.rowCount == 0) 
                    {
                        pool.query(querySaveState, [data.toString().substring(0, 4), 0, 1, 0]); 
                    }
                    else {
                        pool.query(queryUpdateTurnOff, [1, data.toString().substring(0, 4)]); 
                    }

                })
                .catch((err) => {

                    console.log(err);
                    console.log("tive esse erro");
                })
        }

        else if (data.toString().includes("LOW_BATTERY")) {
           
            pool.query(queryGetId, [data.toString().substring(0, 4)])
                .then((response) => {

                    if (response.rowCount == 0) 
                    {
                        pool.query(querySaveState, [data.toString().substring(0, 4), 0, 0, 1]); 
                    }
                    else { 
                        pool.query(queryUpdateLowBattery, [1, data.toString().substring(0, 4)]); 
                    }

                })
                .catch((err) => {

                    console.log(err);
                    console.log("tive esse erro");
                })
        }



        else if (data.toString().substring(0, 1) == 'A') {

            setTimeout(() => {
                socket.write("RS1");
            }, 100);
            saveData(data.toString());  
            setState(data.toString());
        }

        else if (data.toString().substring(0, 1) == 'B') {
            setTimeout(() => {
                socket.write("RS1"); 
            }, 100);
            saveDataWithOld(data.toString());
            setState(data.toString()); 

        }

    });


});


function setState(data) {

    pool.query(queryGetId, [data.substring(1, 5)])

        .then((response) => {

            if (response.rowCount == 0) 
            {
                pool.query(querySaveState, [data.substring(1, 5), 0, 0, 0]); 
            }
            else {
                pool.query(queryUpdateTurnOffandGoff, [0, 0, data.substring(1, 5)]); 
            }

        })
        .catch((err) => {
            console.log("erro!")
            console.log(err);

        })
}


function saveData(data) {

    let dados = data;
    let dados_array = dados.split("/");
    dados_array[7] = addZero(dados_array[7]); //mes
    dados_array[6] = addZero(dados_array[6]); //dia
    dados_array[5] = addZero(dados_array[5]); //hora
    dados_array[4] = addZero(dados_array[4]); //min
    dados_array[3] = addZero(dados_array[3]); //seg
    dados_array[0] = dados_array[0].substring(1, 5)  //retira o A do ID do equipamento

    var array = `${dados_array[8]}-${dados_array[7]}-${dados_array[6]} ${dados_array[3]}:${dados_array[4]}:${dados_array[5]}`; 
    console.log(array);

    pool.query(querySaveData, [dados_array[0], dados_array[1], dados_array[2], array, dados_array[9]])

}

function saveDataWithOld(data) {
    let dados = data;
    let bloco_array = dados.split("M");
    let ID = bloco_array[0].substring(1, 5); 
    bloco_array.forEach((valor) => {
        let dados_array = valor.split("/");
        dados_array[7] = addZero(dados_array[7]); //mes
        dados_array[6] = addZero(dados_array[6]); //dia
        dados_array[5] = addZero(dados_array[5]); //hora
        dados_array[4] = addZero(dados_array[4]); //min
        dados_array[3] = addZero(dados_array[3]); //seg   

        var array = `${dados_array[8]}-${dados_array[7]}-${dados_array[6]} ${dados_array[3]}:${dados_array[4]}:${dados_array[5]}`; 

        if ((dados_array[1] != undefined) && (dados_array[2] != undefined)) {
            pool.query(querySaveData, [ID, dados_array[1], dados_array[2], array, dados_array[9]]) 
        }
        else {
            console.log("valores vazios recebidos");
        }

    })

}