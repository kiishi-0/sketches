const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

let animate = true;

const settings = {
  dimensions: [1080, 1080],
  animate: animate,
  duration: 10,
};

let fontSize = 1200;
const image = new Image();
let fontFamily = 'serif'
const cell = 20;
const spacing = cell * 0.1;
const cellWithSpacing = cell + spacing;
let frameCount = 0;

const sketch = ({ context, width, height }) => {
  
  const cols = Math.floor(width/cell);
  const rows = Math.floor(height/cell);
  const numCells = cols * rows;
  let agents = [];

  // Load the image and set up the agents
  let iw, ih, ix, iy, data;
  image.src = "PA.jpg";
  image.onload = function(){
    iw = image.naturalWidth;
    ih = image.naturalHeight;
    ix = (width - iw) * 0.5;
    iy = (height - ih) * 0.50;

    context.drawImage(image, 0, 0, cols, rows );
    data = context.getImageData(0, 0, cols, rows).data;

    for (let i = 0; i < numCells; i++){
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r =  data[i * 4 + 0];
      const g =  data[i * 4 + 1];
      const b =  data[i * 4 + 2];
      const agent = new Agent(r, g, b, x, y, cell, col, row, animate);

      agents.push(agent);
    }
  };

  // Set up the animation loop
  return ({ context, width, height, time }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // Update and draw each agent
    agents.forEach( agent =>{
      
      if(agent.f > 10){
        agent.update(time);
      }
      agent.draw(context, cols, rows);

      // setTimeout(() => { // add a delay using setTimeout
      //   agent.draw(context, cols, rows);
      // }, 100);
    });
  };
};

canvasSketch(sketch, settings);

class Agent{
  constructor(r, g, b, x, y, f, col,row, animate){
    this.col = col;
    this.row = row;
    this.f = f * 3;
    this.sf = f * 3;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.animate = animate;
  }

  update(time){
    const delay = frameCount * 10;
    if (this.f <= this.sf * 0.1) {
      setTimeout(() => {
        this.f = 20;
        this.animate = false;
        console.log(delay)
      }, delay);
      // Stop animation when this.f <= 5
    } else {
       // Increase the delay with each frame
      
        this.f -= 0.5;
      
    }
    frameCount++;
    
  }

  draw(context, cols, rows){
    context.save();
    const ans = (this.r < 240 && this.g < 240 && this.b < 240  )|| (this.col < (cols * 0.75) && this.col > (cols * 0.25))? true : false;
    context.fillStyle = ans ? `rgb(${this.r}, ${this.g}, ${this.b})`: "black";
    if(this.col < cols * 0.90 && this.col > cols * 0.1){
      if(this.r > 240 && this.g > 240 && this.b > 240  ){
        context.fillStyle = "black";
      }
    }

    context.translate(this.x , this.y);
    context.beginPath();
    let glyph = this.getGlyph(this.r);

    context.font = `${this.f * 2}px ${fontFamily}`;
    context.textBaseLine = "middle";
    context.textAlign = 'center';

      if (Math.random() < 0.1) context.font = `${ this.f * 6}px ${fontFamily}`;
      context.fillText(glyph, 0, 0);
      context.stroke();
      context.restore();
    
  }
  getGlyph(v){
    if(v < 50) return 'Innovation';
    if(v < 100) return 'Investments';
    if(v < 150) return 'UCAP';
    if(v < 200) return 'PA';

    // const glyph = "/=_~".split('');

    return "InvestNow";
  }
}
