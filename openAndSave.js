let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// download task
downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

//open file (upload)
openBtn.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let file = input.files;
        let fileObj = file[0];
        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);
            
            // Basic sheet with default data will be created 
            addSheetBtn.click();

            // SheetDB, graphComponent
            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];

            collectedSheeDB[collectedSheeDB.length-1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length-1] = graphComponentMatrix;

            handleSheetProp();
        })

    })
})