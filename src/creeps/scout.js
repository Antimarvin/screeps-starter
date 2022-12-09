var roleScout = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working){
            if(creep.room.name !== creep.memory.targetRoom){
                console.log(`Moving ${creep.name} in ${creep.room.name} to ${creep.memory.targetRoom}`)
                creep.moveTo(new RoomPosition(25,25,creep.memory.targetRoom))
            }
            else {
                console.log(`${creep.name} has arived in ${creep.memory.targetRoom}, see ${creep.room.name}`)
                creep.memory.working = false
                creep.memory.targetRoom = undefined
            }
        }
    },
    defaultSettings: function (serialNumber) {
        return {
            name: `Scout_${serialNumber}`,
            baseBody: [TOUGH,TOUGH,MOVE],
            scalingBody: [],
            memory: {
                role: 'scout',
                working: false,
                targetRoom: undefined
            }
        }
    }
}

module.exports = roleScout;