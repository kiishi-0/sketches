const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const image = new Image();
const typeCanvas = document.createElement('canvas');
const typeContext =typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {

  const iw = width * 0.25;
  const ih = height * 0.75;
  const ix = width * 0.2 *0.5;
  const iy = height * 0.25 * 0.5;
  let nw, nh;


  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    image.src="PA.jpg";
    image.onload = ()=>{
      nw = image.naturalWidth;
      nh = image.naturalHeight;

      console.log(nw, nh,iw)

      context.save();
      context.translate(ix, iy);
      context.beginPath();
      context.drawImage(image, nw*0.5, 0, nw *0.5, nh, 0, 0, iw, ih );
      context.restore();
    }

    context.fillStyle="black";
    context.lineWidth = 1;
    // console.log(context.lineWidth)
    context.translate(ix + iw + 50, iy);
    context.rect(0, 0, 10, ih );
    // context.rect(ix + iw + 70, iy, 10, ih );
    context.fill();
    context.restore();

    let text = "PETER ASHADE".split("");

    for (i =0; i< text.length; i++){

      let l = text[i]

      const metrics = context.measureText(l);
      console.log(metrics);
      const mx = metrics.actualBoundingBoxLeft * -1;
      const my = metrics.actualBoundingBoxAscent * -1;
      const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;  
      const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      console.log(mx, my, mw, mh)
      typeContext.save();
      typeContext.beginPath();
      typeContext.rect(mx, my, mw, mh);
      typeContext.stroke();
      typeContext.fillText(l, 0, 0);
      typeContext.translate(ix + iw + mx * i + 10, iy);
      typeContext.fillText(l, 0, 0);
      typeContext.restore();
      
    }

  };

};

const getFont = (f) =>{
  if(f == 2){
    
  }
}

canvasSketch(sketch, settings);
