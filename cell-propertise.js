// storage
let collectedSheeDB = []; //contain all sheet DB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}
/* (let i = 0; i < row; i++) {
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
}*/

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontcolor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];


//Attach property listeners

// for bold botton
let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    //Modification 
    cellProp.bold = !cellProp.bold; // Data change
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; 

})

// for italic botton
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    //Modification 
    cellProp.italic = !cellProp.italic; // Data change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; 

})

//for underline botton
underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    //Modification 
    cellProp.underline = !cellProp.underline; // Data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; 
})

//for font size
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

//for font family
fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

//for font color
fontcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontcolor = fontcolor.value;
    cell.style.color = cellProp.fontcolor;
    fontcolor.value = cellProp.fontcolor;
})
//for background color
BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.BGcolor = BGcolor.value;
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})
//for Alignment
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment;

        switch(alignValue) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp; 
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp; 
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp; 
                break;        
        }
    })
})

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length;i++){
    addListenerToAttachCellPropertise(allCells[i]);
}

function addListenerToAttachCellPropertise(cell) {
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid,cid] = decoderowcolAddress(address);
        let cellProp = sheetDB[rid][cid];
        // Apply cell Propertise
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontcolor;
        cell.style.backgroundColor = cellProp.BGcolor == "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;       

        // Apply Propertise UI Prop container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontcolor.value = cellProp.fontcolor;
        BGcolor.value = cellProp.BGcolor;
        switch(cellProp.alignment) { // UI change
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp; 
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp; 
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp; 
                break;        
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value; 
    })
}

function getCellAndCellProp(address) {
    let [rid, cid] = decoderowcolAddress(address);
    // Acess cell & storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];

}

function decoderowcolAddress(address) {
    // address -> "A1"
    let rid = Number(address.slice(1))-1; // "1" -> 0
    let cid = Number(address.charCodeAt(0))-65; // "A" -> 65 -> 0
    return [rid,cid];
}