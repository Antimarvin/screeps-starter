

StructureSpawn.prototype.createScalingWorker = function (role, energy){
    let baseBodyCost = BODYPART_COST.work + 2 * ( BODYPART_COST.move) + BODYPART_COST.carry;
    let bodyStacks = Math.floor(energy/baseBodyCost);
    let workerBaseBodyDefinition = [WORK,MOVE,MOVE,CARRY];
    let body = [];

    for(let part of workerBaseBodyDefinition){
        for(let i = 0; i < bodyStacks; i ++ ){
            body.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(body, name, {memory: {role: role, working: false}});
}

StructureSpawn.prototype.createHarvester = function (role, energy){
    let bodyStacks = Math.min(Math.floor((energy-BODYPART_COST.move)/BODYPART_COST.work), 5);
    let workerBaseBodyDefinition = [WORK];
    let body = [MOVE];

    for(let part of workerBaseBodyDefinition){
        for(let i = 0; i < bodyStacks; i ++ ){
            body.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(body, name, {memory: {role: role, working: false}});
}