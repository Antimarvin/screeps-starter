StructureSpawn.prototype.createScalingCreep = function (name, baseBody, scalableBody, memory, maxEnergy = this.room.energyCapacityAvailable) {
    if(Memory.creeps[name]){
        delete Memory.creeps[name];
    }


    let baseBodyCost = getBodyCost(baseBody)
    let scaleableBodyCost = getBodyCost(scalableBody)
    let bodyStacks = Math.floor((maxEnergy - baseBodyCost) / scaleableBodyCost);

    for (let part of scalableBody) {
        for (let i = 0; i < bodyStacks; i++) {
            baseBody.push(part);
        }
    }
    return this.spawnCreep(baseBody, name, {memory: memory});
}

function getBodyCost(body) {
    let cost = 0
    for(let part of body) {
        cost = cost + BODYPART_COST[part.toLowerCase()]
    }
    return cost
}