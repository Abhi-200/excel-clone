for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if(enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            //if data modifies by user
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula) {
        //If change in formula
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);
        //Check formula is cyclic or Not
        let cycleResponse = IsGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
           let response = confirm("There is a cyclic formula. Do you want to trace this cyclic formula?");
           while(response === true) {
                //Keep on tracking color until user id satisfied
                await IsGraphCyclicTracePath(graphComponentMatrix,cycleResponse); // I want to complete full iteration of color tracking, so I will attach wait here also
                response = confirm("There is a cyclic formula. Do you want to trace this cyclic formula?");
           }
           removeChildFromGraphComponent(inputFormula, address);
           return; 
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        // To update UI and cellProp in Data base
        setCellUIAndCellProp(evaluatedValue, inputFormula,address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
        //console.log(sheetDB);
        
    }
})

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decoderowcolAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <=90) {
            let [prid, pcid] = decoderowcolAddress(encodedFormula[i]);
            
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decoderowcolAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <=90) {
            let [prid, pcid] = decoderowcolAddress(encodedFormula[i]);
            
            graphComponentMatrix[prid][pcid].pop();
        }
    } 
}

function updateChildrenCells(parentAddress) {
    let [parentCell,parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length;i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" "); 
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }  
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" "); 
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }  
    }
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" "); 
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }  
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, Formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    // UI update
    cell.innerText = evaluatedValue;
    //Data base update
    cellProp.value = evaluatedValue;
    cellProp.formula = Formula;
}