var harvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        let target = Game.getObjectById(creep.memory.targetSourceID)

        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },
    defaultSettings: function (targetSourceID, serialNumber){
        return {
            name: `Harvester_${targetSourceID}_${serialNumber}`,
            baseBody: [],
            scalingBody: [WORK,WORK,MOVE],
            memory: {
                role: 'harvester',
                targetSourceID: targetSourceID
            },
            energyLimit: 750
        }
    }
}

module.exports =  harvester;