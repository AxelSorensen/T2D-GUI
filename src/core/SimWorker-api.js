import Worker from 'worker-loader!./SimWorker'

export default class SimWorkerApi{
    /**
     * Constructs the SimWorker
     * @param {*} simpar 
     */
    constructor(sim){
        this.simWorker = new Worker();
        this.simWorker.postMessage(JSON.parse(JSON.stringify(sim)))
    }
    /**
     * Sends message to worker
     * @param {String} msg 
     */
    sendMessage(msg){
        this.simWorker.postMessage(msg);
    }
    /**
     * Returns the SimWorker instance
     */
    getWorker(){
        return this.simWorker;
    }

    /**
     * Terminates worker
     */
    TerminateWorker(){
        this.simWorker.terminate();
        console.log("Worker Terminated");
    }
}