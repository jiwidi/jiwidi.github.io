// An explanatory cutaway: the supplied exterior mesh has no internal geometry.
// The film gate, travelling curtains and coupled optical path are modelled here.
export function createCameraCutaway(T) {
  const group = new T.Group();
  const filmSystem = new T.Group();
  const opticalSystem = new T.Group();
  group.add(filmSystem, opticalSystem);
  const ink = new T.MeshBasicMaterial({ side: T.DoubleSide });
  const paper = new T.MeshBasicMaterial({ side: T.DoubleSide });
  const glass = new T.MeshBasicMaterial({ transparent: true, opacity: 0.45, side: T.DoubleSide, depthWrite: false });
  const line = new T.LineBasicMaterial({ transparent: true, opacity: 0.9 });
  const beamMaterial = new T.LineDashedMaterial({ transparent: true, opacity: 0.9, dashSize: 2, gapSize: 1.5 });
  const labels = [];
  const rollers = [];
  const holes = [];
  const filmFrames = [];
  const curtainMaterial = new T.MeshBasicMaterial({ side: T.DoubleSide });
  const frameLine = new T.LineBasicMaterial({ transparent: true, opacity: .35 });
  const mesh = (geometry, material, position, parent = filmSystem) => {
    const item = new T.Mesh(geometry, material);
    item.position.set(...position);
    item.userData.cutaway = true;
    parent.add(item);
    return item;
  };
  const path = (points, parent = filmSystem, material = line) => {
    const item = new T.Line(new T.BufferGeometry().setFromPoints(points.map(p => new T.Vector3(...p))), material);
    item.computeLineDistances();
    item.userData.cutaway = true;
    parent.add(item);
    return item;
  };
  const outline = (x, y, z, w, h, parent = filmSystem) => path([
    [x-w/2,y-h/2,z],[x+w/2,y-h/2,z],[x+w/2,y+h/2,z],[x-w/2,y+h/2,z],[x-w/2,y-h/2,z],
  ], parent);
  const caption = (text, position, parent, width = 26) => {
    const canvas = document.createElement('canvas');
    canvas.width = 384; canvas.height = 64;
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.position.set(...position);
    sprite.scale.set(width, width / 6, 1);
    parent.add(sprite);
    labels.push({ text, canvas, texture });
  };

  // Cartridge and take-up spool, on either side of the 36 × 24 mm film gate.
  for (const x of [-53, 55]) {
    const roller = new T.Group(); roller.position.set(x, -7, -15); filmSystem.add(roller);
    mesh(new T.CylinderGeometry(9, 9, 41, 32), paper, [0,0,0], roller);
    for (const y of [-22,22]) mesh(new T.CylinderGeometry(11,11,2,32), ink, [0,y,0], roller);
    for(let i=0;i<8;i++) {
      const angle=i*Math.PI/4;
      path([[Math.cos(angle)*9.1,-19,Math.sin(angle)*9.1],[Math.cos(angle)*9.1,19,Math.sin(angle)*9.1]],roller);
    }
    rollers.push(roller);
  }
  mesh(new T.BoxGeometry(100, 35, 0.3), ink, [0,-7,-19]);
  for (let i = 0; i < 3; i++) {
    const frame = outline(0, -6, -18.6, 34, 24);
    frame.material = frameLine;
    frame.userData.initialX = -28 + i * 38;
    filmFrames.push(frame);
  }
  for(let i=0;i<22;i++) for(const y of [-22,8]) {
    const hole=mesh(new T.PlaneGeometry(2.8,1.8),paper,[-47+i*4.5,y,-18.8]);
    hole.userData.initialX=hole.position.x; holes.push(hole);
  }
  // The film plane sits behind the curtains; an exposure briefly uncovers it.
  mesh(new T.PlaneGeometry(36,24),paper,[10,-6,-18.5]);
  outline(10,-6,-14.5,39,27);
  const firstCurtain=mesh(new T.PlaneGeometry(36,24),curtainMaterial,[10,-6,-16]);
  const secondCurtain=mesh(new T.PlaneGeometry(36,24),curtainMaterial,[-27,-6,-15.5]);
  for(const curtain of [firstCurtain,secondCurtain]) {
    for(let i=-15;i<=15;i+=3) path([[i,-11,0.05],[i,11,0.05]],curtain,new T.LineBasicMaterial({ transparent:true,opacity:0.18 }));
  }
  caption('FILM',[-51,-37,-8],filmSystem,18);
  caption('SHUTTER',[10,-32,0],filmSystem,29);
  path([[10,-27,0],[10,-22,-14.5]],filmSystem);

  // Two entrance windows feed a moving mirror and a fixed beam splitter.
  const mirrorPivot = new T.Group(); mirrorPivot.position.set(-47,25,-5); opticalSystem.add(mirrorPivot);
  const mirror=mesh(new T.BoxGeometry(0.8,10,13),paper,[0,0,0],mirrorPivot);
  mirror.rotation.y=Math.PI/4;
  const splitter=mesh(new T.BoxGeometry(0.6,11,14),glass,[43,25,-5],opticalSystem);
  splitter.rotation.y=Math.PI/4;
  for(const x of [-47,43]) {
    mesh(new T.BoxGeometry(13,11,1),glass,[x,25,7],opticalSystem);
    outline(x,25,7.7,13,11,opticalSystem);
  }
  mesh(new T.BoxGeometry(10,9,1),paper,[43,25,-29],opticalSystem);
  const beams=path([[-47,25,13],[-47,25,-5],[43,25,-5],[43,25,-29]],opticalSystem,beamMaterial);
  path([[43,25,13],[43,25,-29]],opticalSystem,beamMaterial);
  // A cam follower links lens focus to the small rotation of the mirror.
  const follower=path([[10,10,5],[10,17,-6],[-47,17,-6],[-47,25,-5]],opticalSystem);
  caption('RANGEFINDER',[0,43,0],opticalSystem,49);
  path([[0,39,0],[0,25,-5]],opticalSystem);

  function theme(foreground, background, accent) {
    ink.color.copy(foreground);
    paper.color.copy(background);
    glass.color.copy(accent);
    line.color.copy(foreground);
    beamMaterial.color.copy(accent);
    curtainMaterial.color.copy(foreground).lerp(background, .18);
    frameLine.color.copy(background);
    for(const curtain of [firstCurtain,secondCurtain]) curtain.children.forEach(c=>c.material.color.copy(background));
    for(const label of labels) {
      const ctx=label.canvas.getContext('2d');
      ctx.clearRect(0,0,384,64);
      ctx.font='500 34px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=`#${foreground.getHexString()}`;ctx.fillText(label.text,192,32);label.texture.needsUpdate=true;
    }
  }
  function focus(value) {
    mirrorPivot.rotation.y=(value-0.5)*0.3;
    follower.position.y=(value-0.5)*1.2;
    const positions=beams.geometry.attributes.position;
    positions.setZ(2,-5+(value-0.5)*4);
    positions.needsUpdate=true;
  }
  function transport(progress) {
    const distance = progress * 36;
    rollers.forEach(roller=>{roller.rotation.y=distance/9;});
    holes.forEach(hole=>{hole.position.x=-49+((hole.userData.initialX+49+distance)%99);});
    filmFrames.forEach(frame=>{
      const center = -66 + ((frame.userData.initialX + 66 + progress * 38) % 114);
      const left = Math.max(-49, center - 17), right = Math.min(49, center + 17);
      frame.visible = right > left;
      frame.position.x = (left + right) / 2;
      frame.scale.x = Math.max(.0001, (right - left) / 34);
    });
  }
  // Clip each curtain to the gate: the remainder winds onto its side roller.
  function placeCurtain(curtain, center) {
    const left = Math.max(-8, center - 18), right = Math.min(28, center + 18);
    curtain.visible = right > left;
    curtain.scale.x = Math.max(0.0001, (right - left) / 36);
    curtain.position.x = (left + right) / 2;
  }
  function cock(progress) {
    placeCurtain(firstCurtain, 47 - 37 * progress);
    placeCurtain(secondCurtain, 10 - 37 * progress);
  }
  function exposure(progress, ready) {
    const smooth=t=>{const v=Math.min(1,Math.max(0,t));return v*v*(3-2*v);};
    if(progress===null) {
      placeCurtain(firstCurtain, ready?10:47);
      placeCurtain(secondCurtain, ready?-27:10);
    } else {
      placeCurtain(firstCurtain, 10+37*smooth(progress/0.56));
      placeCurtain(secondCurtain, -27+37*smooth((progress-0.38)/0.62));
    }
  }
  function inspect(part) {
    filmSystem.visible=part!=='rangefinder';
    opticalSystem.visible=part!=='shutter';
  }
  return { group, theme, focus, transport, cock, exposure, inspect };
}
