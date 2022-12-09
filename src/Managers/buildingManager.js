let creepLogic = require('.././creeps/index');

function buildingManager(castleRoom){

    Memory.buildingManager = {
        creeps: [creepLogic.builder.defaultSettings(castleRoom.name,1),
                 creepLogic.builder.defaultSettings(castleRoom.name,2)]
    }

    let constructionSites = Object.keys(Game.constructionSites).map( function (key){
        return {[key]: Game.constructionSites[key]}
    })

    let mystructures = []
    for(let roomKey in Game.rooms){
        let room = Game.rooms[roomKey]
        //console.log(room.find(FIND_STRUCTURES, {filter: s => s.my}))
        let myRoomStructures = room.find(FIND_STRUCTURES, {filter: s => s.my})
        for(let structure of myRoomStructures){
            mystructures.push(structure)
        }
    }

    let highPriorityRepair = _.filter(mystructures, s => s.hits < s.hitsMax
        && (s.structureType === STRUCTURE_SPAWN
        || s.structureType === STRUCTURE_STORAGE
        || s.structureType === STRUCTURE_EXTENSION))
    //console.log(JSON.stringify(highPriorityRepair))
    let highPriorityRepairList = Object.keys(highPriorityRepair).map( function (key){
        return {[key]: highPriorityRepair[key]}
    })

    //console.log(JSON.stringify(highPriorityRepairList))
    let mediumPriorityRepair = _.filter(mystructures, s => s.hits < s.hitsMax
        && (s.structureType === STRUCTURE_LAB
            || s.structureType === STRUCTURE_CONTAINER
            || s.structureType === STRUCTURE_LINK))
    let mediumPriorityRepairList = Object.keys(mediumPriorityRepair).map( function (key){
        return {[key]: mediumPriorityRepair[key]}
    })

    let lowPriorityRepair = _.filter(mystructures, s => s.hits < s.hitsMax
        && (s.structureType === STRUCTURE_LAB
            || s.structureType === STRUCTURE_CONTAINER
            || s.structureType === STRUCTURE_LINK))
    let lowPriorityRepairList = Object.keys(lowPriorityRepair).map( function (key){
        return {[key]: lowPriorityRepair[key]}
    })

    // Check to make sure all your creeps are spawned, if not add them to build queue
    for(let i = 0; i < Memory.buildingManager.creeps.length; i++) {
        if(!(Memory.buildingManager.creeps[i].name in Game.creeps)){
            console.log(`${Memory.buildingManager.creeps[i].name} was not in game creeps`)
            castleRoom.memory.buildQueue.medium.push(Memory.buildingManager.creeps[i])
        }
    }
    let builders = _.filter(Game.creeps, c => c.memory.role === 'builder')
    //console.log(JSON.stringify(builders))
    if(Object.keys(builders).length > 0){
        for(let b in builders){
            let builder = builders[b]
            console.log(`The length of constructionsites is ${constructionSites.length}`)
            console.log(`The length of high repair is ${highPriorityRepairList.length}`)
            console.log(`The length of medium repair is ${mediumPriorityRepairList.length}`)
            console.log(`The length of low repair is ${mediumPriorityRepairList.length}`)
            if(constructionSites.length > 0){
                //console.log(JSON.stringify(constructionSite))
                let target = constructionSites.pop()
                builder.memory.job = "Build"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else if (highPriorityRepairList.length > 0){
                let target = highPriorityRepairList.pop()
                builder.memory.job = "Repair"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else if (mediumPriorityRepairList.length > 0){
                let target = mediumPriorityRepairList.pop()

                builder.memory.job = "Repair"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else if (lowPriorityRepairList.length > 0){
                let target = lowPriorityRepairList.pop()
                builder.memory.job = "Repair"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else {
                builder.memory.job = "Upgrade"
                builder.memory.jobTarget = builder.room.controller
            }
        }
    }


}
module.exports = buildingManager