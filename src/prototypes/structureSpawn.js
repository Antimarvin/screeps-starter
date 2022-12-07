

StructureSpawn.prototype.createScalingWorker = function (role, energy){
    let scaleableBodyCost = BODYPART_COST.work + ( BODYPART_COST.move) + BODYPART_COST.carry;
    let bodyStacks = Math.floor(energy/scaleableBodyCost);
    let workerBaseBodyDefinition = [WORK,MOVE,CARRY];
    let baseBody = [];

    for(let part of workerBaseBodyDefinition){
        for(let i = 0; i < bodyStacks; i ++ ){
            baseBody.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(baseBody, name, {memory: {role: role, working: false}});
}

StructureSpawn.prototype.createHarvester = function (role, energy){
    let bodyStacks = Math.min(Math.floor((energy) /(BODYPART_COST.move + (2 * BODYPART_COST.work))), 3);
    let scaleableBody = [MOVE, WORK, WORK];
    let baseBody = [];

    for(let part of scaleableBody){
        for(let i = 0; i < bodyStacks; i ++ ){
            baseBody.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(baseBody, name, {memory: {role: role, working: false}});
}

StructureSpawn.prototype.createTruck = function (role, energy){
    let scaleableBodyCost = (BODYPART_COST.move + BODYPART_COST.carry);
    let bodyStacks = Math.floor(energy/scaleableBodyCost);
    let scaleableBody = [MOVE,CARRY];
    let baseBody = [];

    for(let part of scaleableBody){
        for(let i = 0; i < bodyStacks; i ++ ){
            baseBody.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(baseBody, name, {memory: {role: role, working: false}});
}