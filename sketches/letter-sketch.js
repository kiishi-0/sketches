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
  typeCanvas.height

  

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle= "black";
    context.font = `${fontSize}px ${fontFamily}`;
    context.textBaseLine = "top";


    const metrics = context.measureText(text);
    console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;  
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    console.log(mx, my, mw, mh)
    const x = (width - mw) * 0.5 - mx;
    const y = (height - mh) * 0.5 - my;
    
    context.save();
    context.translate(x, y);

    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();
    context.fillText(text, 0, 0);
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

