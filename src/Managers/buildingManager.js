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


    let highPriorityRepair = _.filter(mystructures, i => i.hits < i.hitsMax
        && (i.structureType === STRUCTURE_SPAWN
        || i.structureType === STRUCTURE_STORAGE
        || i.structureType === STRUCTURE_EXTENSION))

    //console.log(JSON.stringify(highPriorityRepairList))
    let mediumPriorityRepair = _.filter(mystructures, i => i.hits < i.hitsMax
        && (i.structureType === STRUCTURE_LAB
            || i.structureType === STRUCTURE_CONTAINER
            || i.structureType === STRUCTURE_LINK))

    let lowPriorityRepair = _.filter(mystructures, i => i.hits < i.hitsMax)



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
            let builderIndex = 0
            let builder = builders[b]
            console.log(`The length of constructionSites is ${constructionSites.length}`)
            console.log(`The length of high repair is ${highPriorityRepair.length}`)
            console.log(`The length of medium repair is ${mediumPriorityRepair.length}`)
            console.log(`The length of low repair is ${lowPriorityRepair.length}`)
            if(constructionSites.length > 0){
                //console.log(JSON.stringify(constructionSite))
                let target = constructionSites.pop()
                builder.memory.job = "Build"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else if (highPriorityRepair.length > 0){
                let target = highPriorityRepair
                builder.memory.job = "Repair"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else if (mediumPriorityRepair.length > 0){
                let target = mediumPriorityRepair.pop()

                builder.memory.job = "Repair"
                builder.memory.jobTarget = target[Object.keys(target)[0]]
            }
            else if (lowPriorityRepair.length > 0){
                let target = lowPriorityRepair.pop()
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