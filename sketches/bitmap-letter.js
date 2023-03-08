const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif'

const typeCanvas = document.createElement('canvas');
const typeContext =typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width/cell);
  const rows = Math.floor(height/cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    typeContext.fillStyle= "white";
    fontSize = cols
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseLine = "top";


    const metrics = typeContext.measureText(text);
    console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;  
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    console.log(mx, my, mw, mh)
    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;
    
    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();
    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    // const som = typeContext.getImageData(0, 0, cols, rows);
    
    // console.log(som);
    // console.log(som.data);

    context.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < numCells; i++){
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r =  typeData[i * 4 + 0];
      const g =  typeData[i * 4 + 1];
      const b =  typeData[i * 4 + 2];
      const a =  typeData[i * 4 + 3];

      
      // context.strokeStyle = "red";
      // console.log(`rgb(${r}, ${g}, ${b}) yeel`)
      context.save();
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.translate(x, y);
      context.fillRect(0,0, cell, cell);
      
      context.stroke();
      context.restore();
    }
  };
};


document.addEventListener('keyup', (e)=>{
  text = e.key.toUpperCase(); 
  manager.render()
})

const start = async () =>{
  manager = await canvasSketch(sketch, settings);
}

start();

