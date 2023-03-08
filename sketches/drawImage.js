const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

let animate = true;

const settings = {
  dimensions: [1080, 1080],
  animate: animate,
  duration: 10,
};

const image = new Image();
let fontFamily = 'serif'
const cell = 20;

let iw, ih, ix, iy, data;

const sketch = ({ context, width, height }) => {
  
  const cols = Math.floor(width/cell);
  const rows = Math.floor(height/cell);
  const numCells = cols * rows;
  let agents = [];

  // Load the image and set up the agents
  
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
      const a =  data[i * 4 + 3];
      const agent = new Agent(r, g, b, a, x, y, cell, col, row, animate);

      agents.push(agent);
    }
  };

  // Set up the animation loop
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // Update and draw each agent
    agents.forEach( agent =>{
    
      agent.update();
      agent.draw(context, cols, rows);
      if(agent.f <= 14){
        agent.draw(context, cols, rows, true);
      }
      
    });
  };
};

canvasSketch(sketch, settings);

class Agent{
  constructor(r, g, b, a, x, y, f, col,row, animate){
    this.col = col;
    this.row = row;
    this.f = f * 3;
    this.sf = f;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 1;
    // this.sa = sa;
    this.x = x;
    this.y = y;
    this.animate = animate;
  }

  update(){
    // const delay = frameCount * 10;
    // if (this.f <= this.sf * 0.1) {
    //   // setTimeout(() => {
    //     this.f = 20;
    //     // console.log(delay)
    //   // }, delay);
    //   // Stop animation when this.f <= 5
    // } else {
    //    // Increase the delay with each frame
      
    //     this.f -= 0.5;
      
    // }
    // frameCount++;
    if(this.f > 12){
      this.f -= 0.5;
    }
    while(this.a > 0.1 && this.f <= 12){
      // console.log(this.a)
      this.a -= 0.05;
    }
    
    
  }

  draw(context, cols, rows, isNew = false){
    context.save();
    
    context.fillStyle = this.getColor(isNew ? 1 -( math.mapRange(this.a, 0, 1, 1, 0)) : this.a , cols)
    context.translate(this.x , this.y);
    context.beginPath();
    let glyph = isNew? this.newGlyph(this.r) : this.getGlyph(this.r);

    context.font = `${ this.f}px ${fontFamily}`;
    context.textBaseLine = "middle";
    context.textAlign = 'center';

    if(!isNew){
      if (Math.random() < 0.1) context.font = `${ this.f * 6}px ${fontFamily}`;
    }
    if(isNew){
      // context.fillStyle = this.getColor(isNew ? 1 - this.a : this.a )
      context.fillRect(0, 0, this.sf, this.sf);
    }else{
      context.fillText(glyph, 0, 0);
    }
    
    context.stroke();
    context.restore();
    
  }
  getColor(a, cols){
    let color;
    const ans = (this.r < 240 && this.g < 240 && this.b < 240  )|| (this.col < (cols * 0.75) && this.col > (cols * 0.25))? true : false;
    color = ans ? `rgb(${this.r}, ${this.g}, ${this.b}, ${a})`: `rgba(0, 0, 0, ${a})`;
    if(this.col < cols * 0.90 && this.col > cols * 0.1){
      if(this.r > 240 && this.g > 240 && this.b > 240  ){
        color = `rgba(0, 0, 0, ${a})`;
      }
    }
    return color;
  }
  getGlyph(v){
    if(v < 50) return 'Innovation';
    if(v < 100) return 'Investments';
    if(v < 150) return 'InvestNow';
    if(v < 200) return 'PA';

    return "UCAP";
  }
  newGlyph(v){
    if(v < 50) return 'U';
    if(v < 100) return 'C';
    if(v < 150) return 'A';
    if(v < 200) return 'P';

    // const glyph = "/=_~".split('');

    return "UCAP";
  }
}
