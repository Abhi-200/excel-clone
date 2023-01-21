// Storage -> 2D array 
let collectedGraphComponent = [];
let graphComponentMatrix = [];

/*for (let i = 0; i < row; i++) {
    let Row = [];
    for (let j = 0; j < col; j++) {
        // Why array -> More than 1 child relation(dependency)
        Row.push([]);
    }
    graphComponentMatrix.push(Row);
}*/

// True -> cyclic, False -> Not cyclic 
function IsGraphCyclic(graphComponentMatrix) {
    //Dependency -> visited, dfsVisited
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

    for(let i = 0; i < row;i++) {
        for(let j = 0; j < col;j++) {
            if(visited[i][j] === false) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if(response === true) return [i, j];
            }
        }
    }
    return null;
}

function dfsCycleDetection(graphComponentMatrix, sr, sc, visited, dfsVisited) {
    visited[sr][sc] = true;
    dfsVisited[sr][sc] = true;
    // A1 -> [ [0,1], [1, 0], [5, 0], .....]
    for(let children = 0; children < graphComponentMatrix[sr][sc].length;children++) {
        let [crid, ccid] = graphComponentMatrix[sr][sc][children];
        if(visited[crid][ccid] === false) {
           let response = dfsCycleDetection(graphComponentMatrix, crid, ccid, visited, dfsVisited);
           if(response == true) return true;
        }
        else if (visited[crid][ccid] === true && dfsVisited[crid][ccid] === true) return true;
    }

    dfsVisited[sr][sc] = false;
    return false;
}