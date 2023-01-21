// Server creation;
const http = Require('http');
const fs = Require('fs');

const server=http.creationServer((req,res)=>{
    res.setHeader('Content-Type','text/html');
    fs.readFile('./excel clone/index.html',(err,fileData)=>{
        if(err){
            console.log(err);
        }else{
            res.write(fileData);
            res.end();

        }
    })
});

server.listen(3000,'localhost',()=>{
    console.log('srever is listening on port 3000');
});