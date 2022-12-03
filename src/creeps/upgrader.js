let harvester = require('./harvester')

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {

            if(creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
            }
            if(creep.store.getFreeCapacity() === 0){
                creep.memory.working = true
            }
        }
        else if (creep.memory.working) {
            creep.say('Upgrading');
            if(creep.transfer(creep.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if (creep.store.energy === 0) {
                creep.memory.working = false
            }
        }
    }
};

module.exports = roleUpgrader;