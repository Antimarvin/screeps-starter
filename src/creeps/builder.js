var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.store.energy === 0) {
            creep.memory.working = false
            creep.memory.job = false
            creep.memory.jobTarget = false
        }
        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        if(!creep.memory.working || !creep.memory.job) {

            if(creep.room.name === creep.memory.home){
                let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE)
                        && s.store.energy >= creep.store.getFreeCapacity()
                })

                let droppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,{
                    filter: resources => resources.amount >= creep.store.getFreeCapacity()
                })

                if (availableContainer) {
                    if (creep.withdraw(availableContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(availableContainer);
                    }
                }
                else {
                    if(creep.pickup(droppedResources) === ERR_NOT_IN_RANGE){
                        creep.moveTo(droppedResources)
                    }
                }
            }
            else {
                creep.moveTo(new RoomPosition(25,25,creep.memory.home))
            }
        }
        else if (creep.memory.working) {

            let target = new RoomPosition(creep.memory.jobTarget.pos.x,creep.memory.jobTarget.pos.y,creep.memory.jobTarget.pos.roomName)

            if (creep.room.name === target.roomName) {

                if (creep.pos.inRangeTo(target, 3)) {
                    if (creep.memory.job === "Build") {
                        if(creep.build(Game.getObjectById(creep.memory.jobTarget.id)) === ERR_INVALID_TARGET){
                            creep.memory.job = false
                            creep.memory.jobTarget = false
                        }
                    } else if (creep.memory.job === "Repair") {
                        if(creep.repair(Game.getObjectById(creep.memory.jobTarget.id)) === ERR_INVALID_TARGET){
                            creep.memory.job = false
                            creep.memory.jobTarget = false
                        }
                    } else if (creep.memory.job === "Upgrade") {
                        creep.upgradeController(Game.getObjectById(creep.memory.jobTarget.id))
                    } else {
                        creep.say("Stalled")
                    }
                }
                else{
                    creep.moveTo(target)
                }
            }
            else {
                creep.moveTo(new RoomPosition(target.x, target.y, target.roomName))
            }
        }
    },
    defaultSettings: function (home, serialNumber){
        let name = `Builder_${serialNumber}`
        return {
            name: name,
            baseBody: [],
            scalingBody: [WORK, CARRY, MOVE],
            memory: {
                role: 'builder',
                job : false,
                jobTarget: false,
                working: false,
                home: home
            },
        }
    }
}

module.exports = roleBuilder;