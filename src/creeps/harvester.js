var harvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        let targetMiningSpot = new RoomPosition(creep.memory.targetMiningPosition.x,
            creep.memory.targetMiningPosition.y, creep.memory.targetMiningPosition.roomName)

        //console.log(`${creep.name} is near mining position ${creep.pos.isNearTo(targetMiningSpot)}`)
        if(creep.pos.isEqualTo(targetMiningSpot)) {
            //console.log(`${creep.name} is going to try and mine ${Game.getObjectById(creep.memory.targetSourceID)}`)
            creep.harvest(Game.getObjectById(creep.memory.targetSourceID))
        }
        else{
            //console.log(`${creep.name} is going to move to ${JSON.stringify(targetMiningSpot)}`)
            creep.moveTo(targetMiningSpot)
        }
    },
    defaultSettings: function (targetSourceID, targetMiningPosition, serialNumber){
        return {
            name: `Harvester_${targetSourceID}_${serialNumber}`,
            baseBody: [],
            scalingBody: [WORK,WORK,MOVE],
            memory: {
                role: 'harvester',
                targetSourceID: targetSourceID,
                targetMiningPosition: targetMiningPosition
            },
            energyLimit: 750
        }
    }
}

module.exports =  harvester;