const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const w = width * .10, h = height * .10, gap = width * .03, ix = width * 0.17, iy = height * 0.17;
    let x, y, off = width * .02;
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 5; j++){
            x = ix + (w + gap) * i;
            y = iy + (h + gap) * j;
            context.lineWidth = 4;
            context.strokeStyle = "white"
            context.beginPath();
            context.rect(x, y, w, h);
            context.stroke();
            if(Math.random() < 0.5){
                context.beginPath();
                context.rect(x + off/2, y + off/2, w-off, h-off);
                context.stroke();
            }
            
        }
        
    }
  };
};

canvasSketch(sketch, settings);
