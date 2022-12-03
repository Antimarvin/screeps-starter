var roleTruck = {
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
            creep.say('Vroom');
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_SPAWN
                           || s.structureType === STRUCTURE_EXTENSION
                           || s.structureType === STRUCTURE_TOWER)
                           && s.energy < s.energyCapacity
            });

            if (creep.transfer(structure,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
            if (creep.store.energy === 0) {
                creep.memory.working = false
            }
        }
    }
}

module.exports = roleTruck;