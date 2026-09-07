// Preserve the supplied silhouette, but render separate paper, grip and glass
// surfaces rather than shading the entire STL as one solid material.
export function createCameraExterior(T, geometry) {
  const group=new T.Group();
  const paper=new T.MeshBasicMaterial();
  const gripCanvas=document.createElement('canvas');gripCanvas.width=1024;gripCanvas.height=512;
  const gripTexture=new T.CanvasTexture(gripCanvas);gripTexture.colorSpace=T.SRGBColorSpace;
  const grip=new T.MeshBasicMaterial({map:gripTexture});
  const metal=new T.MeshBasicMaterial();
  const ink=new T.MeshBasicMaterial();
  const glass=new T.MeshBasicMaterial();
  const edge=new T.LineBasicMaterial({transparent:true,opacity:0.75});
  const reflection=new T.LineBasicMaterial({transparent:true,opacity:0.7});
  const materials=[paper,grip,metal];
  const positions=geometry.attributes.position;
  // The STL is one connected mesh. Isolate the raised advance assembly by
  // connectivity above the top plate, then separate its concentric release.
  const candidates = new Map(), neighbours = new Map();
  const key = i => [positions.getX(i), positions.getY(i), positions.getZ(i)].map(v => v.toFixed(3)).join(',');
  for (let i = 0; i < positions.count; i += 3) {
    const verticesAt = [i,i+1,i+2];
    // Include the lever's side walls down to the top plate, while excluding
    // the plate itself. Otherwise those walls remain as a stationary ghost.
    if (!verticesAt.every(j => positions.getY(j) >= 32.999 && positions.getX(j) < -9)
      || !verticesAt.some(j => positions.getY(j) > 33.001)) continue;
    const vertices = [i,i+1,i+2].map(key);
    candidates.set(i, vertices);
    vertices.forEach(v => { if (!neighbours.has(v)) neighbours.set(v, []); neighbours.get(v).push(i); });
  }
  let seed, closest = Infinity;
  for (const i of candidates.keys()) {
    const d = (positions.getX(i)+43.67)**2 + (positions.getZ(i)+7.916)**2;
    if (d < closest) { closest = d; seed = i; }
  }
  const assembly = new Set(), queue = seed === undefined ? [] : [seed];
  while (queue.length) {
    const i = queue.pop();
    if (assembly.has(i)) continue;
    assembly.add(i);
    candidates.get(i).forEach(v => neighbours.get(v).forEach(j => { if (!assembly.has(j)) queue.push(j); }));
  }
  const buttonFaces = [], leverFaces = [];
  for (const i of assembly) {
    const isButton = [i,i+1,i+2].every(j => Math.hypot(positions.getX(j)+43.67, positions.getZ(j)+7.916) < 3.6);
    (isButton ? buttonFaces : leverFaces).push(i);
  }
  const controlMaterial = new T.MeshBasicMaterial({ side: T.DoubleSide });
  const shutterMaterial = new T.MeshBasicMaterial({ side: T.DoubleSide });
  function control(faces, action, pivot, material = controlMaterial) {
    const data = [];
    faces.forEach(i => { for (let j=i;j<i+3;j++) data.push(positions.getX(j)-pivot[0],positions.getY(j)-pivot[1],positions.getZ(j)-pivot[2]); });
    const part = new T.BufferGeometry();
    part.setAttribute('position',new T.Float32BufferAttribute(data,3));
    const item = new T.Mesh(part,material);
    item.position.set(...pivot);
    item.userData.action = action;
    item.add(new T.LineSegments(new T.EdgesGeometry(part,35),edge));
    group.add(item);
    return item;
  }
  const shutter = control(buttonFaces,'shoot',[-43.67,37.956,-7.916],shutterMaterial);
  const lever = control(leverFaces,'advance',[-43.67,35.5,-7.916]);
  const uv=new Float32Array(positions.count*2);
  for(let i=0;i<positions.count;i++) {uv[i*2]=positions.getX(i)/150+.5;uv[i*2+1]=positions.getY(i)/77+.5;}
  geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
  const indices=[];geometry.clearGroups();let last=-1,start=0;
  for(let i=0;i<positions.count;i+=3) {
    if (assembly.has(i)) continue;
    // The STL closes the lens with a solid disc. Replace only that cap with glass.
    if([i,i+1,i+2].every(j=>positions.getZ(j)>30.55))continue;
    const z=(positions.getZ(i)+positions.getZ(i+1)+positions.getZ(i+2))/3;
    const material=z>11?2:1;
    if(material!==last){if(last!==-1)geometry.addGroup(start,indices.length-start,last);start=indices.length;last=material;}
    indices.push(i,i+1,i+2);
  }
  geometry.addGroup(start,indices.length-start,last);
  // Close the footprint where the moving assembly was joined to the STL.
  // This also removes its old silhouette from the stationary body's edges.
  const rim = new Map(), rimIndices = new Map();
  for (const i of assembly) {
    const base = [i,i+1,i+2].filter(j => Math.abs(positions.getY(j)-33) < .001);
    if (base.length !== 2) continue;
    const [a,b] = base.map(key);
    base.forEach(j => rimIndices.set(key(j),j));
    if (!rim.has(a)) rim.set(a,[]);
    if (!rim.has(b)) rim.set(b,[]);
    rim.get(a).push(b); rim.get(b).push(a);
  }
  const capStart = indices.length, visited = new Set();
  for (const first of rim.keys()) {
    if (visited.has(first)) continue;
    const loop = []; let current = first;
    while (current !== undefined && !visited.has(current)) {
      visited.add(current); loop.push(rimIndices.get(current));
      current = rim.get(current).find(next => !visited.has(next));
    }
    const contour = loop.map(i => new T.Vector2(positions.getX(i),positions.getZ(i)));
    for (const triangle of T.ShapeUtils.triangulateShape(contour,[])) {
      const [a,b,c] = triangle.map(i => loop[i]);
      const cross = (positions.getX(b)-positions.getX(a))*(positions.getZ(c)-positions.getZ(a))
        - (positions.getZ(b)-positions.getZ(a))*(positions.getX(c)-positions.getX(a));
      indices.push(...(cross > 0 ? [a,c,b] : [a,b,c]));
    }
  }
  if (indices.length > capStart) geometry.addGroup(capStart,indices.length-capStart,1);
  geometry.setIndex(indices);
  const shell=new T.Mesh(geometry,materials);shell.userData.shell=true;group.add(shell);
  const outline=new T.LineSegments(new T.EdgesGeometry(geometry,34),edge);group.add(outline);
  const optics=new T.Group();optics.position.set(10.14,-5.46,0);group.add(optics);
  const lensMesh=(geometry,material,z)=>{const mesh=new T.Mesh(geometry,material);mesh.position.z=z;optics.add(mesh);return mesh;};
  lensMesh(new T.RingGeometry(15.3,22.5,96),ink,30.65);
  lensMesh(new T.RingGeometry(18.6,19.1,96),paper,30.72);
  lensMesh(new T.RingGeometry(15.3,15.9,96),paper,30.75);
  lensMesh(new T.CircleGeometry(15.3,96),glass,30.7);
  const line=(points,material=edge)=>{const item=new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),material);optics.add(item);return item;};
  for(let i=0;i<48;i++) {
    const a=i/48*Math.PI*2,x=Math.cos(a)*22.7,y=Math.sin(a)*22.7;
    line([[x,y,22],[x,y,26.5]]);
  }
  for(const radius of [10.5,6]) {
    line(Array.from({length:65},(_,i)=>[Math.cos(i/64*Math.PI*2)*radius,Math.sin(i/64*Math.PI*2)*radius,30.85]),reflection);
  }
  line(Array.from({length:20},(_,i)=>{const a=.8+i/19*1.2;return[Math.cos(a)*12.6,Math.sin(a)*12.6,30.9];}),reflection);
  const diaphragm=line(Array.from({length:7},(_,i)=>[Math.cos(i/6*Math.PI*2)*8,Math.sin(i/6*Math.PI*2)*8,30.9]),reflection);
  const allMaterials=[...materials,ink,glass];
  function theme(foreground,background,accent) {
    paper.color.copy(background);
    metal.color.copy(background).lerp(foreground,.06);
    ink.color.copy(foreground);
    glass.color.copy(foreground).lerp(background,.08);
    edge.color.copy(foreground);
    reflection.color.copy(background);
    const ctx=gripCanvas.getContext('2d');
    const light = background.r + background.g + background.b > 1.5;
    const gripColor = light ? foreground.clone().lerp(background,.025) : background.clone().lerp(foreground,.08);
    // A continuous texture keeps the panel boundary straight even where the
    // source mesh uses a single large triangle across two body surfaces.
    ctx.fillStyle=`#${background.getHexString()}`;ctx.fillRect(0,0,1024,512);
    ctx.fillStyle=`#${gripColor.getHexString()}`;ctx.fillRect(0,130,1024,325);
    ctx.fillStyle=`#${(light ? background : foreground).getHexString()}`;ctx.globalAlpha=.12;
    for(let y=132;y<453;y+=5)for(let x=2+(y%2)*2;x<1024;x+=5){ctx.beginPath();ctx.arc(x,y,.65,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;gripTexture.needsUpdate=true;
  }
  function xray(enabled) {
    allMaterials.forEach(material=>{material.transparent=enabled;material.opacity=enabled ? 0.035 : 1;material.depthWrite=!enabled;material.needsUpdate=true;});
    edge.opacity=enabled ? 0.14 : 0.75;
    optics.visible=!enabled;
  }
  function focus(value){optics.rotation.z=(value-.5)*.28;}
  return {group,theme,xray,focus,diaphragm,shutter,lever,controlMaterial,shutterMaterial};
}
