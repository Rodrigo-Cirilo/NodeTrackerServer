module.exports = function addZero(valor){
   //função para adicionar 0 quando seg, min, hora, dia, mes estiver com digitos de 0-9
        let res = valor;
       
        if (res < 10) {
            res = `0${res}`;
            return res.toString();
        }
        else {
            return valor;
        }
    }
