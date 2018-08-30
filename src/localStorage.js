var localStorage = window.localStorage;

module.exports = {
    add:function(key,value,expires = -1){
        let storage = {};
        storage['value'] = value;
        if(expires > 0){
            storage['expires'] = ( Date.parse(new Date()) / 1000 ) + expires;
        }else{
            storage['expires'] = -1;
        }
        let save = JSON.stringify(storage);
        
        return localStorage.setItem(key,save);
    },
    get:function(key){
     
        let storage = localStorage.getItem(key);
        
        if(storage == undefined || storage == null){
            return null;
        }

        let info = JSON.parse(storage);

        let now = (Date.parse(new Date())/1000);
        if(now > info.expires && info.expires > 0){
            return null;
        } 
        return info.value;
    },
    clear:function(key){
        return localStorage.removeItem(key);
    },
    clearAll:function(){
        localStorage.clear();
    },
};