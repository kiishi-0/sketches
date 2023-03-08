const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

let animate = true;

const settings = {
  dimensions: [1080, 1080],
  animate: animate,
  duration: 10,
};

const image = new Image();
let fontFamily = 'serif'
const cell = 10;

let iw, ih, ix, iy, data;

// const bcanvas = document.createElement('canvas');
// const cxt = bcanvas.getContext('2d');

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

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    agents.forEach( agent =>{
    
      agent.draw(context, cols, rows);
      
    });

    const b1 = new Banner(0, 0, width, 200, "PETER".split(''));
    const b2 = new Banner(0, height - 200, width, 200, "ASHADE".split(''));

    b1.buildBanner(context);
    b2.buildBanner(context);
    // console.log(b1)
  };
};

canvasSketch(sketch, settings);
class Banner{
  constructor(x, y, width, height, word){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.word = word;
  }

  buildBanner(cxt){
    
    // cxt.fillRect(this.x, this.y, this.width, this.height);
    cxt.fillStyle = 'black';
    cxt.save();
    cxt.translate(this.x, this.y)
    cxt.fillRect(0, 0, this.width, this.height);
    cxt.font = `150px ${fontFamily}`;
    cxt.fillStyle = "white"
    cxt.strokeStyle = "green"
    cxt.textAlign = "right";

    const wordWidth = this.word.reduce((total, letter) => {
      const wm = cxt.measureText(letter);
      return total + wm.actualBoundingBoxLeft + wm.actualBoundingBoxRight;
    }, 0);

    let x = (this.width - wordWidth) * 0.45;

    this.word.forEach((letter, k)=>{
      
      const metrics = cxt.measureText(letter)
      let [lx, y, mw, mh] = this.letterPos(this.width, this.height, metrics);
      // cxt.textAlign = "lefy"
      cxt.save();
      cxt.beginPath();
      // cxt.translate(lx * (k * 0.25) + (this.width * 0.2), y);
      cxt.translate(x + lx * (k * 0.25), y);
      cxt.fillText(letter, 0, 0);
      cxt.rect(0, 0, mw, mh)
      // cxt.stroke();
      cxt.restore();


    })
    cxt.restore();

  }

  letterPos(w, h, metrics){
    // const metrics = context.measureText(text);
    // console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;  
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    // console.log(mx, my, mw, mh)
    const lx = (w - mw) * 0.5 - mx;
    const y = (h - mh) * 0.5 - my;
    
    // context.save();
    // context.translate(x, y);

    return [lx, y, mw, mh];


    // context.beginPath();
    // context.rect(mx, my, mw, mh);
    // context.stroke();
    // context.fillText(text, 0, 0);
  }
}

class Agent{
  constructor(r, g, b, a, x, y, f, col,row, animate){
    this.col = col;
    this.row = row;
    this.f = f;
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
    
    context.fillStyle = this.getColor(isNew ? 1 - this.a : this.a , cols)
    context.translate(this.x , this.y);
    context.beginPath();
    let glyph = isNew? this.newGlyph(this.r) : this.getGlyph(this.r);

    context.font = `${ this.f * 2}px ${fontFamily}`;
    context.textBaseLine = "middle";
    context.textAlign = 'center';

    
    if(isNew){
      // context.fillStyle = this.getColor(isNew ? 1 - this.a : this.a )
      context.fillRect(0, 0, this.f, this.f);
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
    if(v < 50) return 'U';
    if(v < 100) return 'P';
    if(v < 150) return 'A';
    if(v < 200) return 'C';
    if(v < 250) return  '@'

    const glyph = "PA   ".split('');

    return random.pick(glyph);
  }
  
}
