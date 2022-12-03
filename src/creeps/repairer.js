const builder = require("./builder");
var roleRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {
            creep.say("Refuel")
            if(creep.pickup(creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES));
            }
            if(creep.store.getFreeCapacity() === 0){
                creep.memory.working = true
            }
        }
        else if (creep.memory.working) {
            creep.say('Repairing');
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax
                                              && s.structureType !== STRUCTURE_WALL})

            if(structure) {
                if (creep.build(structure) === ERR_NOT_IN_RANGE) {

                    creep.moveTo(structure);
                }
            }
            else if (creep.store.energy === 0) {
                creep.memory.working = false
            }
            else {
                builder.run(creep)
            }

        }
    }
}

module.exports = roleRepairer;