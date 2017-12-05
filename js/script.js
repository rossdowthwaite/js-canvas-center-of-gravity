window.onload  = function() {

  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  let centerX = width / 2 ;
  let centerY = height / 2 ;
  let widthSqueezeMin = centerX - ( width / 3 );
  let widthSqueezeMax = centerX + ( width / 3 );
  let heightSqueezeMin = centerY - ( width / 3 );
  let heightSqueezeMax = centerY + ( width / 3 );

  let minRadius = 4;
  let rate = 10;
  let centerCirle;
  let density = 0.001;
  let gravityXY;
  let count = 0;
  let color = '#FFA02F';
  let opacities = [0.1, 0.5, 1, 1 ];


  var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Common = Matter.Common,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies;
  Events = Matter.Events;
  Body = Matter.Body;
  Matter.use('matter-attractors');

  // create engine
  var engine = Engine.create(),
  world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Math.min(width),
      height: Math.min(height),
      showVelocity: false,
      showAngleIndicator: false,
      background: '#072a61',
      wireframes: false
    }
  });

  Render.run(render);

  // Create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  function init(){
    engine.world.gravity.y = 0;
    addCenterCircle(1e-6);
    // updateTime();
  }

  function addBubble(){
    let radius = minRadius + Math.random() * 30;
    let circle = Bodies.circle(getRandomIntInRange(widthSqueezeMin, widthSqueezeMax), getRandomIntInRange(heightSqueezeMin, heightSqueezeMax), radius, {
      isStatic: false,
      isSensor: true,
      restitution: 1,
      frictionAir: 0,
      density: density,
      render: {
        lineWidth: 0,
        opacity: setOpacity()
      }
    });
    World.add(world, circle);
  }

  function addCenterCircle( gravityXY ){
    centerCirle = Bodies.circle(centerX, centerY, 100, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: 'white',
        strokeStyle: 'white',
        lineWidth: 0,
        opacity: 0
      },
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * gravityXY,
              y: (bodyA.position.y - bodyB.position.y) * gravityXY,
            };
          }
        ]
      }
    }, 100);
    centerCirle.isCenter = true;
    World.add(world, centerCirle);
  }

  Events.on(runner, "tick", draw);

  function draw(){
      count++;
      let bodies = Composite.allBodies(engine.world);

      if( count % rate === 0 ){

        addBubble();

        if(bodies.length == 70){
          Matter.World.remove(engine.world, bodies[1]);
        }
      }
  }

  function setOpacity(){
    let index = Math.floor(Math.random() * ( opacities.length - 1 ));
    return opacities[index];
  }

  function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: document.documentElement.clientWidth, y: document.documentElement.clientHeight }
  });

  init();

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function() {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  };
};
