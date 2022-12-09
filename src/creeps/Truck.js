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
            let structureWithEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE)
                    && s.store.energy > 0
            })

            if (structureWithEnergy) {
                if (creep.withdraw(structureWithEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureWithEnergy);
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
            if(primaryStructure) {
                if (creep.transfer(primaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(primaryStructure)
                }
            }
            else {
                creep.say("Stalled")
            }
        }
    },
    defaultSettings: function (serialNumber){
        return {
            name: `Truck_${serialNumber}`,
            baseBody: [],
            scalingBody: [CARRY, CARRY, MOVE],
            memory: {
                role: 'truck',
                working: false
            },

        }
    }
}

module.exports = roleTruck;