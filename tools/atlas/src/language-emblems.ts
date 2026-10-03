import * as THREE from 'three';

const artwork: Record<string, string> = {
  Go: 'gopher', JavaScript: 'javascript', TypeScript: 'typescript',
  PHP: 'php', Python: 'python', HTML: 'html5', CSS: 'css3',
  Elixir: 'elixir', Ruby: 'ruby', Astro: 'astro',
};
const initials: Record<string,string> = { Shell: '$', Makefile: 'MK', 'Protocol Buffer': 'PB', Smarty: 'S' };

// Shared, locally served textures keep the scene independent of third-party hosts.
export function createLanguageEmblems() {
  const materials = new Map<string,THREE.SpriteMaterial>();
  const textures: THREE.Texture[] = [];
  let disposed = false;
  function textureFor(language: string, image?: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    if (image) {
      const scale = 440 / Math.max(image.naturalWidth,image.naturalHeight);
      const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
      ctx.drawImage(image,(512-width)/2,(512-height)/2,width,height);
    } else {
      ctx.fillStyle = '#7f001a';
      ctx.font = 'bold 160px system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(initials[language] ?? language.slice(0,2),256,256,440);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    return texture;
  }
  function create(language?: string) {
    if (!language) return null;
    let material = materials.get(language);
    if (!material) {
      material = new THREE.SpriteMaterial({map:textureFor(language), transparent:true, depthTest:true, depthWrite:false, alphaTest:.02, toneMapped:false});
      materials.set(language,material);
      const filename = artwork[language];
      if (filename) {
        const sharedMaterial = material;
        new THREE.ImageLoader().load(`${import.meta.env.BASE_URL}languages/${filename}.svg`, image => {
          if (disposed) return;
          sharedMaterial.map = textureFor(language,image);
          sharedMaterial.needsUpdate = true;
        });
      }
    }
    return new THREE.Sprite(material);
  }
  return {create,dispose() { disposed = true; materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose()); }};
}
