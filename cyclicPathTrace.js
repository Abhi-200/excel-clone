// for delay and wait
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 500);
    })
}

async function IsGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    
    let [sr, sc] = cycleResponse;
    let visited = [];
    let dfsVisited = [];

    for (let i=0; i < row; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < col; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);    
    }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, sr, sc, visited, dfsVisited);
    if(response === true) return Promise.resolve(true);

    return Promise.resolve(false);
}

// Coloring cell for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, sr, sc, visited, dfsVisited) {
    visited[sr][sc] = true;
    dfsVisited[sr][sc] = true;

    let cell = document.querySelector(`.cell[rid="${sr}"][cid="${sc}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise(); // 1 sec finished  

    for(let children = 0; children < graphComponentMatrix[sr][sc].length;children++) {
        let [crid, ccid] = graphComponentMatrix[sr][sc][children];
        if(visited[crid][ccid] === false) {
           let response = await dfsCycleDetectionTracePath(graphComponentMatrix, crid, ccid, visited, dfsVisited);
           if(response == true){
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);
           }
        }
        else if (visited[crid][ccid] === true && dfsVisited[crid][ccid] === true) {
            let cyclicCell = document.querySelector(`.cell[rid="${crid}"][cid="${ccid}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            

            return Promise.resolve(true);
        }
    }

    dfsVisited[sr][sc] = false;
    return Promise.resolve(false);
}