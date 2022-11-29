var roleUpgrader = {

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
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },
    // checks if the room needs to spawn a creep
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.room.name === room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < 2) {
            return true;
        }
    },
    // returns an object with the data to spawn a new creep
    spawnData: function() {
            let name = 'Upgrader C-';
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'upgrader', busy: false};
        
            return {name, body, memory};
    }
};

module.exports = roleUpgrader;