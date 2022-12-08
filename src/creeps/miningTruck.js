var roleMiningTruck = {
    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
            let mine = new RoomPosition(
                creep.memory.targetMiningPosition.x,
                creep.memory.targetMiningPosition.y,
                creep.memory.targetMiningPosition.roomName
            )

            if (creep.pos.isNearTo(mine)){
                if(creep.room.lookForAt(LOOK_RESOURCES,mine)){
                    creep.pickup(creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES))
                }
                else if(creep.room.lookForAt(LOOK_STRUCTURES,mine)) {
                    creep.withdraw(creep.pos.findClosestByRange(STRUCTURE_CONTAINER), RESOURCE_ENERGY)
                }
            }
            else{
                creep.moveTo(mine);
            }
        }
        else if (creep.memory.working) {

            if (creep.room.name !== creep.memory.depositRoom) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.depositRoom))
            } else {
                //creep.say('Vroom');
                let primaryStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType === STRUCTURE_SPAWN
                            || s.structureType === STRUCTURE_EXTENSION
                            || s.structureType === STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });
                // let secondaryStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                //     filter: s => (s.structureType === STRUCTURE_CONTAINER)
                //         && s.store.energy < s.store.getCapacity()
                // });

                if (primaryStructure) {
                    if (creep.transfer(primaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(primaryStructure)
                    }
                }
                // else if (secondaryStructure) {
                //     if (creep.transfer(secondaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                //         creep.moveTo(secondaryStructure);
                //     }
                else {
                    creep.say("Stalled")
                }
            }
        }
    },
    defaultSettings: function (targetSourceID, targetMiningPosition, depositRoom, serialNumber){
        return {
            name: `MiningTruck_${targetSourceID}_${serialNumber}`,
            baseBody: [],
            scalingBody: [CARRY, CARRY, MOVE],
            memory: {
                role: 'miningTruck',
                working: false,
                targetMiningPosition: targetMiningPosition,
                depositRoom: depositRoom
            }
        }
    }
}

module.exports = roleMiningTruck;