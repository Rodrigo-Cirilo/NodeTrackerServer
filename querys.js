
module.exports = {

querySaveData : "INSERT INTO rastreador_v2 (equipamento_id, latitude, longitude, date_time, velocidade) VALUES ($1, $2, $3, $4, $5)",

querySaveState : "INSERT INTO rastreador_v2_states (equipamento_id, goffstate, turnoffstate, lowbatterystate) VALUES ($1, $2, $3, $4)",

 queryUpdategOff : "UPDATE rastreador_v2_states SET goffstate = $1 WHERE equipamento_id = $2",

 queryUpdateTurnOff : "UPDATE rastreador_v2_states SET turnoffstate = $1 WHERE equipamento_id = $2",

 queryUpdateTurnOffandGoff : "UPDATE rastreador_v2_states SET turnoffstate = $1, goffstate = $2 WHERE equipamento_id = $3",

 queryUpdateLowBattery : "UPDATE rastreador_v2_states SET lowbatterystate = $1 WHERE equipamento_id = $2",

 queryGetId : "SELECT equipamento_id FROM rastreador_v2_states WHERE equipamento_id = ($1)"

}