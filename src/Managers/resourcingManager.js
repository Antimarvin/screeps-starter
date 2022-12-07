

function getEmpireSources() {

    let empireSources = []

    for(let r in Memory.rooms) {
        if(Memory.rooms[r].sources){
            for(let s in Memory.rooms[r].sources) {
                empireSources.push(s)
            }
        }
    }
    return empireSources
}


 function resourcingManager(){

    //create object if it doesnt exist
    if(!Memory.resourcingManager) {
        Memory.resourcingManager = {}
    }

    //create list of all sources
    for(let s of getEmpireSources()){
        if(s !== undefined){
            let sourceObject = Game.getObjectById(s)

            Memory.resourcingManager[s] = {
                source: Game.getObjectById(s),
                miningLocations: Memory.rooms[sourceObject.room.name].sources[s].miningLocations,
            }
        }
    }
 }
 module.exports = resourcingManager