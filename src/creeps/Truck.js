var roleTruck = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
            //creep.say("Refuel")
            let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
                    && s.store.energy > 0
                    && s.room.memory.containers[s.id].mine === true
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
        }
        else if (creep.memory.working) {
            //creep.say('Vroom');
            let primaryStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_SPAWN
                           || s.structureType === STRUCTURE_EXTENSION
                           || s.structureType === STRUCTURE_TOWER)
                           && s.energy < s.energyCapacity
            });
            let secondaryStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_CONTAINER)
                          && s.store.energy < s.store.getCapacity()
                          && s.room.memory.containers[s.id].mine === false
            });

            if(primaryStructure) {
                if (creep.transfer(primaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(primaryStructure)
                }
            }
            else if (secondaryStructure) {
                if (creep.transfer(secondaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(secondaryStructure);
                }
            }
            else {
                creep.say("Stalled")
            }
        }
    }
}

module.exports = roleTruck;