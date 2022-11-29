let creepLogic = require('../creeps');

//Finds optimum quantity and body type for a given source and storage location... eventually.
function findOptimumSourcePlan(storageLocation, source) {
    let creepList = []
    let sourcePlan = {};
    sourcePlan.quantity = 2;
    sourcePlan.bodyType = "speed";
    sourcePlan.target = source.id;

    for(let i=0; i < sourcePlan.quantity; i++){
        let spawnData = creepLogic.harvester.spawnData(sourcePlan.bodyType);
        spawnData.memory.target = sourcePlan.target;
        spawnData.name = spawnData.name + source.id + "_" + i;
        creepList.push(spawnData)
    }
    return creepList;
}

Room.prototype.creepNotInQueue = function creepNotInQueue(creep){
    for(let c of this.memory.buildQueue){
        if(c.name === creep.name){
            return false
        }
        //console.log(c.name + "does not equal " + creep.name)
    }
    return true
}

Room.prototype.creepNotExist = function creepNotExist(test_creep){
    for(let c in Game.creeps){
        let creep = Game.creeps[c];
        if(creep.name === test_creep.name){
            return false
        }
        //console.log(creep.name + "does not equal " + test_creep.name)
    }
    return true
}


//Update room.memory.resourcePlan with sources as keys, and lists of required harvesters for the sources

Room.prototype.resourcePlanning = function resourcePlanning(){
    console.log("Creating resource plan for  "+ this.name);
    //ensure attribute is created
    this.memory.resourcePlan = {};

    let roomSources = this.find(FIND_SOURCES);

    for(let source of roomSources){
        this.memory.resourcePlan[source.id] = findOptimumSourcePlan(this.find(FIND_MY_SPAWNS)[0], source);
    }
}


Room.prototype.upgradePlanning = function upgradePlanning(){
    console.log("Creating Upgrade Plan for " + this.name);

    let controller = this.controller.id
    let quantity = 2
    let creepList = []

    for (let i = 0; i < quantity; i++){
        let spawnData = creepLogic.upgrader.spawnData();
        spawnData.memory.target = controller;
        spawnData.name = spawnData.name + controller + "_" + i;
        creepList.push(spawnData)
    }
    this.memory.upgradePlan = creepList
}

//Initialize rooms with data
Room.prototype.init = function init(){
    console.log("Running init.")
    if(!this.memory.buildQueue) {
        this.memory.buildQueue = [];
    }
    this.resourcePlanning();
    this.upgradePlanning();

}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    //if this room has no memory then initialize the room
    if (!this.memory || debug_status) {
        this.init();
    }


    // if you don't have a resource Plan, make one
    console.log("Updating " + this.name);
    let rp = this.memory.resourcePlan;
    let up = this.memory.upgradePlan;
    if (!rp) {
        this.resourcePlanning();
    }
    // If you have one (catching empty rooms), adjust build queue as required.
    if (rp) {
        for (let source in rp) {

            let creeps = _.filter(Game.creeps, c => c.room.name === this.name &&
                c.memory.target === source &&
                c.memory.bodyType === rp[source].bodyType);

            let creepNames = []
            _.forEach(creeps, c => creepNames.push(c.name))

            for(let i in rp[source]) {
                if ((this.creepNotInQueue(rp[source][i]) && this.creepNotExist(rp[source][i]))) {
                    this.memory.buildQueue.push(rp[source][i])

                }
            }
        }
    }

    for(let i in up){
        if(this.creepNotInQueue(up[i]) && this.creepNotExist(up[i])){
            this.memory.buildQueue.push(up[i]);
        }
    }
}
