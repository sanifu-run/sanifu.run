import * as THREE from 'three';
import { createLanguageEmblems } from './language-emblems';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export type AtlasNode = {
  id: string;
  type: string;
  owner: string;
  label: string;
  description?: string;
  url: string;
  language?: string;
  commit_count?: number;
  created_at?: string;
};

type GalleryItem = { node: AtlasNode; mesh: THREE.Mesh; position: THREE.Vector3 };

const BRAND_BACKGROUND = 0x7f001a;

function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) value = Math.imul(value ^ input.charCodeAt(i), 16777619);
  return value >>> 0;
}

function unit(seed: number): number {
  return (seed % 100000) / 100000;
}

export function createGallery(
  container: HTMLElement,
  nodes: AtlasNode[],
  onSelect: (node: AtlasNode | null) => void,
  onYear: (year: string | null) => void,
): { select: (id: string) => void; reset: () => void; setYear: (year: string | null) => void; zoom: (factor: number) => void; destroy: () => void } {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BRAND_BACKGROUND);
  scene.fog = new THREE.Fog(BRAND_BACKGROUND, 110, 220);

  const width = Math.max(1, container.clientWidth);
  const height = Math.max(1, container.clientHeight);
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 220);
  const portraitLayout = width < 650;
  const overviewPosition = () => new THREE.Vector3(4, 11, Math.min(108, Math.max(42, 48 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect) + 5)));
  const overviewTarget = () => new THREE.Vector3(4, 7, 0);
  camera.position.copy(overviewPosition());

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Interactive repository atlas. Use arrow keys to move between repositories and Enter to open one.');
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('role', 'application');
  renderer.domElement.setAttribute('aria-describedby', 'atlas-gallery-keyboard-help');
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(overviewTarget());
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 13;
  controls.maxDistance = 110;
  controls.maxPolarAngle = Math.PI * .95;
  controls.update();

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const envTarget = pmrem.fromScene(environment, 0.04);
  scene.environment = envTarget.texture;
  environment.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x35000e, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-12, 24, 14);
  key.castShadow = false;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -28;
  key.shadow.camera.right = 28;
  key.shadow.camera.top = 26;
  key.shadow.camera.bottom = -18;
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 1.0);
  fill.position.set(19, 12, -16);
  scene.add(fill);

  const repositoryNodes = nodes.filter(node => node.type === 'repository').sort((a,b) => (a.created_at ?? '').localeCompare(b.created_at ?? '') || a.id.localeCompare(b.id));
  const repoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: .13, metalness: .04, transmission: 0,
    attenuationColor: new THREE.Color(0xffffff), attenuationDistance: .7,
    thickness: .8, ior: 1.46, clearcoat: 1, clearcoatRoughness: .09, envMapIntensity: 1.6,
  });
  const repoGeometry = new THREE.SphereGeometry(1, 64, 48);
  const repoSizes = new Map<string, number>();
  const emblems = createLanguageEmblems();
  const languageSprites = new Map<string, THREE.Sprite>();
  const items: GalleryItem[] = [];
  const itemById = new Map<string, GalleryItem>();

  for (const [index, node] of repositoryNodes.entries()) {
    // Creation order runs left to right; height and depth remain truly spatial.
    const x = -18 + (index / Math.max(1, repositoryNodes.length - 1)) * 44;
    const angle = index * 2.399963;
    const spread = 5 + unit(hash(node.id)) * 7;
    const position = new THREE.Vector3(x, 7.5 + Math.sin(angle) * spread * .45, Math.cos(angle) * spread);
    if (portraitLayout) { position.z *= .6; }
    const radius = 2 * (.16 + Math.log10(1 + Math.max(0, node.commit_count ?? 0)) * .16);
    repoSizes.set(node.id, radius);
    const mesh = new THREE.Mesh(repoGeometry.clone().scale(radius, radius, radius), repoMaterial);
    mesh.position.copy(position);
    const emblem = emblems.create(node.language);
    if (emblem) {
      emblem.scale.setScalar(radius * 1.25);
      mesh.add(emblem);
      languageSprites.set(node.id, emblem);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.node = node;
    scene.add(mesh);
    const item = { node, mesh, position };
    items.push(item);
    itemById.set(node.id, item);

  }

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none',
    fontFamily: 'Arial, sans-serif', color: '#fff',
  });
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(overlay);

  const repositoryLabels = new Map<string, HTMLButtonElement>();
  const labelLinks = new Map<string, HTMLSpanElement>();
  const labelSizes = new Map<string, { width: number; height: number }>();
  for (const item of items) {
    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'repository-label';
    label.textContent = `${item.node.owner}/${item.node.label}`;
    label.setAttribute('aria-label', `Explore ${item.node.owner}/${item.node.label}`);
    label.title = `${item.node.owner}/${item.node.label}${item.node.language ? ` · ${item.node.language}` : ''}`;
    label.addEventListener('click', () => select(item.node.id));
    label.addEventListener('pointerdown', event => event.stopPropagation());
    const link = document.createElement('span');
    link.className = 'repository-label-link';
    link.setAttribute('aria-hidden', 'true');
    overlay.append(link, label);
    labelLinks.set(item.node.id, link);
    repositoryLabels.set(item.node.id, label);
  }

  const tooltip = document.createElement('span');
  tooltip.setAttribute('role', 'status');
  Object.assign(tooltip.style, {
    position: 'absolute', display: 'none', maxWidth: '240px', padding: '5px 8px',
    borderRadius: '3px', background: 'rgba(71,0,16,.95)', color: '#fff',
    boxShadow: '0 2px 12px rgba(62,25,29,.12)', font: '12px/1.35 Arial, sans-serif',
  });
  tooltip.setAttribute('aria-live', 'polite');
  tooltip.style.pointerEvents = 'none';
  container.appendChild(tooltip);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickAt = (event: MouseEvent | PointerEvent, tolerance = 14): GalleryItem | null => {
    const intro = document.querySelector('.intro')?.getBoundingClientRect();
    if (intro && event.clientX < intro.right + 16 && event.clientY < intro.bottom + 16) return null;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(items.filter(item => item.mesh.visible).map(item => item.mesh), false)[0];
    if (hit) return items.find(item => item.mesh === hit.object) ?? null;
    // Small spheres retain their visual size while offering a usable click target.
    let closest: GalleryItem | null = null;
    let distance = tolerance;
    for (const item of items) {
      if (!item.mesh.visible) continue;
      const projected = item.position.clone().project(camera);
      if (projected.z < -1 || projected.z > 1) continue;
      const x = (projected.x * .5 + .5) * rect.width + rect.left;
      const y = (-projected.y * .5 + .5) * rect.height + rect.top;
      const candidate = Math.hypot(x - event.clientX, y - event.clientY);
      if (candidate < distance) { closest = item; distance = candidate; }
    }
    return closest;
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hovered: GalleryItem | null = null;
  let selected: GalleryItem | null = null;
  let keyboardIndex = -1;
  let activeYear: string | null = null;
  const visibleNodes = () => repositoryNodes.filter(node => activeYear === null || (node.created_at?.slice(0,4) ?? 'Unknown date') === activeYear);
  let pointerOrigin: { x: number; y: number } | null = null;
  let suppressClick = false;
  let frame = 0;
  let destroyed = false;
  let tween: { fromPosition: THREE.Vector3; toPosition: THREE.Vector3; fromTarget: THREE.Vector3; toTarget: THREE.Vector3; start: number; duration: number } | null = null;
  // Canvas antialiasing alone does not smooth the offscreen post-processing buffers.
  const sceneTarget = portraitLayout ? null : new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    samples: Math.min(4, renderer.capabilities.maxSamples),
  });
  const composer = sceneTarget ? new EffectComposer(renderer, sceneTarget) : null;
  const bokeh = composer ? new BokehPass(scene, camera, { focus: 40, aperture: .0002, maxblur: .005 }) : null;
  if (composer && bokeh) {
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bokeh);
    composer.addPass(new OutputPass());
  }
  const selectionRing = new THREE.Mesh(new THREE.TorusGeometry(.64, .015, 8, 64), new THREE.MeshBasicMaterial({color: 0xffcb61, toneMapped: false}));
  selectionRing.visible = false;
  scene.add(selectionRing);

  const setCameraTarget = (item: GalleryItem, animate: boolean) => {
    const fromTarget = controls.target.clone();
    const direction = camera.position.clone().sub(controls.target);
    const distance = portraitLayout ? 26 : 14;
    direction.setLength(distance);
    const toTarget = item.position.clone().add(new THREE.Vector3(0, portraitLayout ? -3 : 1.8, 0));
    const toPosition = toTarget.clone().add(direction);
    if (!animate || reducedMotion) {
      camera.position.copy(toPosition);
      controls.target.copy(toTarget);
      controls.update();
      tween = null;
    } else {
      tween = {
        fromPosition: camera.position.clone(), toPosition,
        fromTarget, toTarget, start: performance.now(), duration: 700,
      };
    }
  };

  const select = (id: string) => {
    const item = itemById.get(id);
    if (!item) return;
    const itemYear = item.node.created_at?.slice(0,4) ?? 'Unknown date';
    if (activeYear !== null && activeYear !== itemYear) setYear(itemYear);
    if (selected) selected.mesh.scale.setScalar(1);
    selected = item;
    selected.mesh.scale.setScalar(1.8);
    tooltip.style.display = 'none';
    selectionRing.position.copy(item.position);
    selectionRing.scale.setScalar((repoSizes.get(item.node.id) ?? .3) * 1.8 * 1.25 / .64);
    selectionRing.visible = true;
    keyboardIndex = repositoryNodes.findIndex((node) => node.id === item.node.id);
    setCameraTarget(item, true);
    onSelect(item.node);
  };

  const setYear = (year: string | null) => {
    activeYear = year;
    keyboardIndex = -1;
    if (selected) selected.mesh.scale.setScalar(1);
    selected = null;
    selectionRing.visible = false;
    tooltip.style.display = 'none';
    onSelect(null);
    onYear(year);
    const bounds = new THREE.Box3();
    for (const item of items) {
      item.mesh.visible = year === null || (item.node.created_at?.slice(0,4) ?? 'Unknown date') === year;
      if (item.mesh.visible) bounds.expandByObject(item.mesh);
    }
    const target = year === null || bounds.isEmpty() ? overviewTarget() : bounds.getCenter(new THREE.Vector3());
    const size = bounds.isEmpty() ? new THREE.Vector3(1,1,1) : bounds.getSize(new THREE.Vector3());
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = Math.max(13, Math.max(size.y, size.x / camera.aspect) / (2 * Math.tan(halfFov)) * 1.3 + size.z / 2);
    const position = year === null ? overviewPosition() : target.clone().add(new THREE.Vector3(0, distance * .15, distance));
    tween = {start: performance.now(), duration: reducedMotion ? 1 : 650, fromPosition: camera.position.clone(), toPosition: position, fromTarget: controls.target.clone(), toTarget: target};
  };
  const reset = () => setYear(activeYear);

  const onPointerMove = (event: PointerEvent) => {
    if (pointerOrigin && Math.hypot(event.clientX - pointerOrigin.x, event.clientY - pointerOrigin.y) > 6) suppressClick = true;
    const rect = renderer.domElement.getBoundingClientRect();
    hovered = pickAt(event, event.pointerType === 'touch' ? 22 : 12);
    if (hovered) {
      tooltip.textContent = `${hovered.node.owner}/${hovered.node.label}`;
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.max(8, Math.min(event.clientX - rect.left + 14, rect.width - 250))}px`;
      tooltip.style.top = `${Math.max(8, event.clientY - rect.top + 12)}px`;
      renderer.domElement.style.cursor = 'pointer';
    } else {
      tooltip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  };
  const onPointerLeave = () => {
    hovered = null;
    tooltip.style.display = 'none';
    renderer.domElement.style.cursor = 'grab';
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) {
      pointerOrigin = { x: event.clientX, y: event.clientY };
      suppressClick = false;
    }
  };
  const onPointerUp = () => { pointerOrigin = null; };
  const onControlStart = () => { tween = null; };
  const onClick = (event: MouseEvent) => {
    if (suppressClick) { suppressClick = false; return; }
    const item = pickAt(event, (event as PointerEvent).pointerType === 'touch' ? 22 : 14);
    if (item) select(item.node.id);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const navigableNodes = visibleNodes();
    if (!navigableNodes.length) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      keyboardIndex = (keyboardIndex + 1 + navigableNodes.length) % navigableNodes.length;
      const node = navigableNodes[keyboardIndex];
      const item = itemById.get(node.id);
      if (item) setCameraTarget(item, true);
      tooltip.textContent = `${node.owner}/${node.label}`;
      tooltip.style.display = 'block';
      tooltip.style.left = '16px';
      tooltip.style.top = '16px';
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (keyboardIndex < 0) keyboardIndex = 0;
      keyboardIndex = (keyboardIndex - 1 + navigableNodes.length) % navigableNodes.length;
      const node = navigableNodes[keyboardIndex];
      const item = itemById.get(node.id);
      if (item) setCameraTarget(item, true);
      tooltip.textContent = `${node.owner}/${node.label}`;
      tooltip.style.display = 'block';
      tooltip.style.left = '16px';
      tooltip.style.top = '16px';
    } else if (event.key === 'Enter' && keyboardIndex >= 0) {
      event.preventDefault();
      select(navigableNodes[keyboardIndex].id);
    } else if (event.key === 'Escape') {
      tooltip.style.display = 'none';
      reset();
    }
  };

  controls.addEventListener('start', onControlStart);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('click', onClick);
  renderer.domElement.addEventListener('keydown', onKeyDown);

  const projectLabels = () => {
    const rect = renderer.domElement.getBoundingClientRect();
    const intro = document.querySelector('.intro')?.getBoundingClientRect();
    const detail = document.querySelector('.repository-detail')?.getBoundingClientRect();
    const searchBox = document.querySelector('.repo-search')?.getBoundingClientRect();
    type Box = { left: number; right: number; top: number; bottom: number };
    const occupied: Box[] = [];
    for (const protectedArea of [intro, detail, searchBox]) {
      if (protectedArea) occupied.push({left:protectedArea.left-rect.left-12, right:protectedArea.right-rect.left+12, top:protectedArea.top-rect.top-12, bottom:protectedArea.bottom-rect.top+12});
    }
    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    const candidates = items.filter(item => item.mesh.visible).map(item => ({
      item, projected: item.position.clone().project(camera),
      depth: item.position.clone().sub(camera.position).dot(cameraDirection),
    })).sort((a,b) => a.depth - b.depth);
    const onScreen = candidates.filter(({projected,depth}) => depth > 0 && projected.z < 1 && Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1);
    const nearest = onScreen[0]?.depth ?? 0;
    const farthest = onScreen.at(-1)?.depth ?? nearest;
    const frontDepth = nearest + (farthest - nearest) * .3;
    const frontIds = new Set(onScreen.filter(candidate => candidate.depth <= frontDepth).slice(0, portraitLayout ? 8 : 18).map(candidate => candidate.item.node.id));
    candidates.sort((a,b) => a.item === selected ? -1 : b.item === selected ? 1 : a.depth - b.depth);
    for (const item of items) {
      if (!item.mesh.visible) { repositoryLabels.get(item.node.id)!.style.display = 'none'; labelLinks.get(item.node.id)!.style.display = 'none'; }
    }
    for (const {item, projected} of candidates) {
      const label = repositoryLabels.get(item.node.id)!;
      const link = labelLinks.get(item.node.id)!;
      const radius = (repoSizes.get(item.node.id) ?? .3) * (selected === item ? 1.8 : 1);
      const below = item.position.clone().addScaledVector(camera.up, -radius).project(camera);
      const x = (projected.x * .5 + .5) * rect.width;
      const centerY = (-projected.y * .5 + .5) * rect.height;
      const y = (-below.y * .5 + .5) * rect.height + 5;
      const coveredByIntro = intro && x + rect.left < intro.right + 12 && centerY + rect.top < intro.bottom + 12;
      const coveredByDetail = detail && x+rect.left>detail.left && x+rect.left<detail.right && centerY+rect.top>detail.top && centerY+rect.top<detail.bottom;
      const coveredBySearch = searchBox && x+rect.left>searchBox.left && x+rect.left<searchBox.right && centerY+rect.top>searchBox.top && centerY+rect.top<searchBox.bottom;
      const visible = projected.z > -1 && projected.z < 1 && x > 0 && x < rect.width && y > 0 && y < rect.height - 155 && !coveredByIntro && !coveredByDetail && !coveredBySearch && (frontIds.has(item.node.id) || selected === item);
      label.style.display = visible ? 'block' : 'none';
      link.style.display = 'none';
      label.setAttribute('aria-pressed', String(selected === item));
      if (!visible) continue;
      const size = labelSizes.get(item.node.id) ?? {width:label.offsetWidth, height:label.offsetHeight};
      labelSizes.set(item.node.id,size);
      let placement = {x, y};
      let bestOverlap = Infinity;
      // Keep foreground captions close to their spheres and hide crowded ones.
      for (let step = 0; step < 3; step++) {
        for (const direction of step === 0 ? [0] : [1,-1]) {
          const labelY = y + step * (size.height + 3) * direction;
          const labelX = Math.max(size.width/2+4,Math.min(x,rect.width-size.width/2-4));
          const box = {left:labelX-size.width/2-2,right:labelX+size.width/2+2,top:labelY-2,bottom:labelY+size.height+2};
          if (box.top < 8 || box.bottom > rect.height-155) continue;
          const overlap = occupied.reduce((sum, other) => sum + Math.max(0,Math.min(box.right,other.right)-Math.max(box.left,other.left))*Math.max(0,Math.min(box.bottom,other.bottom)-Math.max(box.top,other.top)),0);
          if (overlap < bestOverlap) {bestOverlap=overlap;placement={x:labelX,y:labelY};}
          if (overlap === 0) break;
        }
        if (bestOverlap === 0) break;
      }
      if (bestOverlap > 0 && selected !== item) { label.style.display = 'none'; continue; }
      occupied.push({left:placement.x-size.width/2-2,right:placement.x+size.width/2+2,top:placement.y-2,bottom:placement.y+size.height+2});
      label.style.left = `${placement.x}px`;
      label.style.top = `${placement.y}px`;
      label.style.zIndex = selected === item ? '4' : '2';
      if (Math.abs(placement.y-y)>3 || Math.abs(placement.x-x)>3) {
        const endY = placement.y >= centerY ? placement.y : placement.y + size.height;
        const dx = placement.x-x, dy = endY-centerY;
        Object.assign(link.style,{display:'block',left:`${x}px`,top:`${centerY}px`,width:`${Math.hypot(dx,dy)}px`,transform:`rotate(${Math.atan2(dy,dx)}rad)`});
      }
    }

  };

  const animate = (time: number) => {
    if (destroyed) return;
    frame = requestAnimationFrame(animate);
    if (tween) {
      const raw = Math.min(1, (time - tween.start) / tween.duration);
      const eased = raw * raw * (3 - 2 * raw);
      camera.position.lerpVectors(tween.fromPosition, tween.toPosition, eased);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, eased);
      if (raw >= 1) tween = null;
    }
    controls.update();
    for (const item of items) {
      const emblem = languageSprites.get(item.node.id);
      if (!emblem || !item.mesh.visible) continue;
      const radius = repoSizes.get(item.node.id)!;
      emblem.position.copy(camera.position).sub(item.position).normalize().multiplyScalar(radius * 1.04);
    }
    selectionRing.quaternion.copy(camera.quaternion);
    if (bokeh) bokeh.uniforms.focus.value = selected ? camera.position.distanceTo(selected.position) : camera.position.distanceTo(controls.target);
    projectLabels();
    if (composer) composer.render();
    else renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(animate);

  const resizeObserver = new ResizeObserver(() => {
    const nextWidth = Math.max(1, container.clientWidth);
    const nextHeight = Math.max(1, container.clientHeight);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
    composer?.setSize(nextWidth, nextHeight);
    labelSizes.clear();
  });
  resizeObserver.observe(container);

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
    renderer.domElement.removeEventListener('click', onClick);
    renderer.domElement.removeEventListener('keydown', onKeyDown);
    controls.dispose();
    composer?.passes.forEach(pass => pass.dispose());
    composer?.dispose();
    for (const child of [...scene.children]) {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      }
    }
    repoGeometry.dispose();
    repoMaterial.dispose();
    emblems.dispose();
    envTarget.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    overlay.remove();
    tooltip.remove();
    keyboardHelp.remove();
  };

  const zoom = (factor: number) => {
    tween = null;
    const direction = camera.position.clone().sub(controls.target);
    direction.setLength(THREE.MathUtils.clamp(direction.length() * factor, controls.minDistance, controls.maxDistance));
    camera.position.copy(controls.target).add(direction);
    controls.update();
  };
  return { select, reset, setYear, zoom, destroy };
}
