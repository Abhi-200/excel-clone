let sheetFolderCont = document.querySelector(".sheet-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content">Sheet-${allSheetFolders.length+1}</div>
    `;

    sheetFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    //DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // rightclick(2) leftclick(0) wheel(1)
        if(e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }
        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if(response === false) return;
        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        collectedSheeDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        //UI
        handleSheetUIRemoval(sheet);
        
        // By default DB to sheet 1 (active)
        sheetDB = collectedSheeDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProp();

    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = "#ced6e0";
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheeDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProp() {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // By default click on first cell via
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0;i < allSheetFolders.length;i++)
    {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#ced6e0";
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
      let sheetIdx = Number(sheet.getAttribute("id"));
      handleSheetDB(sheetIdx);
      handleSheetProp();
      handleSheetUI(sheet);
    })
}

function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < row; i++) {
        let sheetRow = [];
        for (let j = 0; j < col; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000",
                value: "",
                formula: "",
                children: [],
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheeDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < row; i++) {
        let Row = [];
        for (let j = 0; j < col; j++) {
            // Why array -> More than 1 child relation(dependency)
            Row.push([]);
        }
        graphComponentMatrix.push(Row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}







