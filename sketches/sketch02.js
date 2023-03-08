const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    // const toRandian = (deg) =>{
    //   return (deg / 180 * Math.PI);
    // }
    context.fillStyle = "black"
    const w = width * .01, h = height * .1, gap = width * .03;
    const cx = width * .5, cy = height * .5;
    const num = 40, radius = width * .30;

    let x, y

    for(let i = 0; i < num; i++){
      const slice = math.degToRad(360/num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y =cy + radius * Math.cos(angle);

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(.1, 3), random.range(.2, .5))

      context.beginPath();
      context.fillRect(-w*.5, random.range(0, -h*.5), w, h);
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = random.range(5, 20)
      context.beginPath();
      context.arc(0, 0, radius * random.range(.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();

      context.restore();
    }
    
  };
};

canvasSketch(sketch, settings);
