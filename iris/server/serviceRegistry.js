'use strict';

class ServiceRegistry {
    
    constructor(timeout, log){
        this._services = [];
        this._timeout = timeout;
        this._log = log;
    }

    add(intent, ip, port, accessToken){
        const key = intent+ip+port+accessToken;

        if(!this._services[key]){
            this._services[key] = {};

            this._services[key].timestamp = Math.floor(new Date()/ 1000);
            this._services[key].ip = ip;
            this._services[key].port = port;
            this._services[key].intent = intent;
            this._services[key].accessToken = accessToken;


            this._log.info(`Added service for intent ${intent} on ${ip}:${port}`);
            this._cleanup();
            return;
        }

        this._services[key].timestamp = Math.floor(new Date()/ 1000);
        this._log.info(`Updated service for intent ${intent} on ${ip}:${port}`);
        this._cleanup();
    }

    remove(intent, ip, port, accessToken){
        const key = intent + ip + port + accessToken;
        delete this._services[key];
    }

    get(intent) {

        this._cleanup();
        // To load balance, select all intents of the request value and randomly sort and select
        // one from the list
        for(let key in this._services){
            if(this._services[key].intent == intent) return this._services[key];
        }
        return null;
    }

    _cleanup() {
        const now = Math.floor(new Date() / 1000);

        for(let key in this._services){
            if(this._services[key].timestamp + this._timeout < now){
                this._log.info(`Removed service for intent ${this._services[key].intent}`);
                delete this._services[key];
            }
        }
    }
}

module.exports = ServiceRegistry;