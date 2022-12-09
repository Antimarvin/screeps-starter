
function getMiningLocations (source) {
    let miningLocations = []

    let verticalRange = 3
    let horizontalRange = 3

    let terrain = Game.map.getRoomTerrain(source.room.name)

    let yIndex = source.pos.y - (Math.floor(verticalRange / 2))
    let xIndex = source.pos.x - (Math.floor(horizontalRange / 2))

    //Loop through terrain map in square vert range x horizontal range centered on source, count non walls
    for(let i = yIndex ; i < (yIndex + verticalRange); i++){
        for(let j = xIndex; j < (xIndex + horizontalRange); j++){
            if(terrain.get(j, i) !== TERRAIN_MASK_WALL){
                console.log("Identified new mining spot at " + j + "," + i )
                miningLocations.push(source.room.getPositionAt(j, i))
            }
        }
    }
    return miningLocations
}

function roomScout(room) {
    //if no memory, create it
    if(!room.memory.adjacentRooms){
        room.memory.adjacentRooms = Game.map.describeExits(room.name)
    }

    if(!room.memory.sources && room.find(FIND_SOURCES)) {
    //if(true){
        room.memory.sources = {}
        for(let s of room.find(FIND_SOURCES)){
            if(!room.memory.sources[s.id]) {
                room.memory.sources[s.id] = {}
                room.memory.sources[s.id].id = s.id
                room.memory.sources[s.id].x = s.pos.x
                room.memory.sources[s.id].y = s.pos.y
                room.memory.sources[s.id].miningLocations = getMiningLocations(s)
            }
        }
    }

    if(!room.memory.controller && room.controller){
        room.memory.controller = room.controller.id
    }

}

module.exports = roomScout