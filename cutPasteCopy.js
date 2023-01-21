let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for(let i = 0;i < row;i++) {
    for(let j = 0;j < col;j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        if(!ctrlKey) return;
        if(rangeStorage.length >=2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }
        //UI
        cell.style.border = "3px solid #218c74";
        
        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
    })
}

function defaultSelectedCellsUI() {
    for(let i = 0; i < rangeStorage.length;i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea"; 
    }
}

cutBtn.addEventListener("click", (e) => {
    if(rangeStorage.length < 2) return;
    
    let srid = rangeStorage[0][0];
    let scid = rangeStorage[0][1];
    let erid = rangeStorage[1][0];
    let ecid = rangeStorage[1][1];
    for(let i = srid;i <= erid;i++) {
        for(let j = scid;j <= ecid;j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.alignment = "left";
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontcolor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.formula = "";
            cellProp.children = "";  
            //UI
            cell.click();  
        }
    }
    defaultSelectedCellsUI();
}) 

let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if(rangeStorage.length < 2) return;
    copyData = [];
    let srid = rangeStorage[0][0];
    let scid = rangeStorage[0][1];
    let erid = rangeStorage[1][0];
    let ecid = rangeStorage[1][1];
    for(let i = srid;i <= erid;i++) {
        let copyRow = [];
        for(let j = scid;j <= ecid;j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click", (e) => {
    // Paste cells data
    if(rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    //Target
    let address = addressBar.value;
    let [stRow, stCol] = decoderowcolAddress(address);

    // r -> refers copyData row
    // c -> refers copyData col
    for(let i = stRow,r = 0;i <= stRow+rowDiff;i++,r++) {
        for(let j = stCol,c = 0;j <= stCol+colDiff;j++,c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell) {
                continue;
            }
            // DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.alignment = data.alignment;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontcolor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.formula = data.formula;
            cellProp.children = data.children;
            //UI
            cell.click();



        }
    }

})
