StructureSpawn.prototype.createScalingCreep = function (baseBody, scalableBody, memory, energy) {
    let baseBodyCost = getBodyCost(baseBody)
    let scaleableBodyCost = getBodyCost(scalableBody)
    let bodyStacks = Math.floor((energy - baseBodyCost) / scaleableBodyCost);

    for (let part of scalableBody) {
        for (let i = 0; i < bodyStacks; i++) {
            baseBody.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(baseBody, name, {memory: memory});
}

function getBodyCost(body) {
    let cost = 0
    for(let part of body) {
        cost = cost + BODYPART_COST[part.toLowerCase()]
    }
    return cost
}