const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,

};

const params= {
  cols: 10,
  rows: 10,
  freq: 0.001,
  scaleMax: 30,
  scaleMin: 1,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    console.log(frame)

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * .80;
    const gridh = height * .80;
    const cellw = gridw/cols;
    const cellh = gridh/rows;

    const margx = (width - gridw) * .5;
    const margy = (height - gridh) * .5;

    for (let i = 0; i < numCells; i++){
      const col = i % cols;
      const row = Math.floor(i/cols);
      const x = col * cellw;
      const y = row * cellh;

      const w = cellw * 0.80;
      const h = cellh * 0.80;
      let f = params.animate ? frame : params.frame;
      const n = random.noise3D(x, y,f * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      console.log(n, x, y);

      // const scale = (n + 1) / 2 *30;
      // const scale = (n * 0.5 + 0.5) *30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);
      console.log(scale);

      context.save();
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh *0.5 );
      context.rotate(angle)

      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      context.beginPath()
      context.moveTo(w * -0.50, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

const createTweakpane = () =>{
  const pane = new Tweakpane.Pane();
  let folder = pane.addFolder({title: 'Grid'});
  folder.addInput(params, 'cols', {min : 2, max: 50, step: 1});
  folder.addInput(params, 'rows', {min : 2, max: 50, step: 1});
  folder.addInput(params, 'scaleMax', {min : 1, max: 100, step: 1});
  folder.addInput(params, 'scaleMin', {min : 1, max: 100, step: 1});
  folder.addInput(params, 'lineCap', {options:{ butt:'butt', round: 'round', square: 'square'}});


  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params, 'freq', {min : -0.01, max: 0.01});
  folder.addInput(params, 'amp', {min : 0, max: 1});
  folder.addInput(params, 'frame', {min : 1, max: 999});
  folder.addInput(params, 'animate');
}

createTweakpane();

canvasSketch(sketch, settings);
