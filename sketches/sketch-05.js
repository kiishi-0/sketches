const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

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
    fontSize = cols * 1.2;
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

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.drawImage(typeCanvas, 0, 0);
    context.textBaseLine = "middle";
    context.textAlign = 'center';


    for (let i = 0; i < numCells; i++){
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r =  typeData[i * 4 + 0];
      const g =  typeData[i * 4 + 1];
      const b =  typeData[i * 4 + 2];
      const a =  typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.save();
      // context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.fillStyle = 'white';
      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;
      context.translate(x, y);
      context.fillText(glyph, 0, 0);
      
      context.stroke();
      context.restore();
    }
  };
};

const getGlyph = (v) =>{
  if(v < 50) return '';
  if(v < 100) return '.';
  if(v < 150) return '-';
  if(v < 200) return 'word';

  const glyph = "/=_~".split('');

  return random.pick(glyph);
}

document.addEventListener('keyup', (e)=>{
  text = e.key.toUpperCase(); 
  manager.render()
})

const start = async () =>{
  manager = await canvasSketch(sketch, settings);
}

start();

