const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ( {context, width, height} ) => {
  let num = 40;
  let agents = []
  for(let i = 0; i < num; i++){
    let x = random.range(0, width);
    let y = random.range(0, height);
    
    agents.push(new Agent(x, y));
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    for(let i = 0; i < agents.length; i++){
      const agent = agents[i]
      for(let j = i + 1; j < agents.length; j++){
        const other = agents[j];
        context.beginPath();
        context.moveTo(agent.point.x, agent.point.y);
        let dist = agent.point.getDist(other.point);

        if(dist > 200){
          continue;
        }
        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1)
        context.lineTo(other.point.x, other.point.y);
        context.stroke();
      }
    }
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  getDist(v){
    let dx = this.x - v.x;
    let dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y){
    this.point = new Point(x, y);
    this.radius = random.range(4, 12);
    this.vel = new Point(random.range(-1, 1), random.range(-1, 1))
  }
  update(){
    this.point.x += this.vel.x;
    this.point.y += this.vel.y;
    // console.log(this.point.x)
  }

  bounce(width, height){
    if (this.point.x >= width || this.point.x <= 0) this.vel.x *= -1;
    if (this.point.y >= height || this.point.y <= 0) this.vel.y *= -1;
  }
  draw(context){
    context.fillStyle = "black";
    context.lineWidth = 4
    context.save();
    context.translate(this.point.x, this.point.y)
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }
}

