var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store[RESOURCE_ENERGY] === 0) {
            if(creep.room.energyAvailable > 0) {
                var storage = creep.room.find(FIND_MY_STRUCTURES).find(structure => structure.store[RESOURCE_ENERGY] > 0);
                if (creep.withdraw(storage, RESOURCE_ENERGY)) {
                    creep.moveTo(storage);
                }
            }
        }
        else {
            if(creep.build(creep.room.find(FIND_CONSTRUCTION_SITES)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function() {
            let name = 'Builder B_';
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'builder', status: false};
        
            return {name, body, memory};
    }
};

module.exports = roleBuilder;