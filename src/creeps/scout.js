var roleScout = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working){
            if(creep.room.name !== creep.memory.targetRoom){
                creep.moveTo(creep.memory.targetRoom)
            }
            else {
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
                targetRoom: undefined,
            }
        }
    }
}

module.exports = roleScout;