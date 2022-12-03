const upgrader = require("./upgrader");
var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {
            creep.say("Refuel")
            let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
                    && s.store.energy >= creep.store.getFreeCapacity()
            })
            let droppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,  {
                filter: r => r.amount >= creep.store.getFreeCapacity()
            })
            if(!availableContainer) {
                if (creep.pickup(droppedResources) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources);
                }
            }
            else if (availableContainer) {
                if (creep.withdraw(availableContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(availableContainer);
                }
            }
            if(creep.store.getFreeCapacity() === 0){
                creep.memory.working = true
            }
        }
        else if (creep.memory.working) {
            creep.say('Building');
            let structure = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)

            if(structure){
                if(creep.build(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
                else if (creep.store.energy === 0) {
                    creep.memory.working = false
                }
            }
            else {
                upgrader.run(creep)
            }
        }
    }
}

module.exports = roleBuilder;