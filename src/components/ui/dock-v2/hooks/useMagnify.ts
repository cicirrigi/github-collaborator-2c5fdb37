'use client';
import { useDockCtx } from '../context';
import { dockTokens } from '../design-tokens';

const gaussian = (
  d: number,
  distance = dockTokens.kernel.distance,
  sigma = dockTokens.kernel.sigma
) => {
  if (Math.abs(d) > distance) return 0;
  return Math.exp(-(d * d) / (2 * sigma * sigma));
};

export function useMagnify(id: string) {
  const { orientation, mouseX, mouseY, getCenter } = useDockCtx();

  const getDistance = () => {
    const c = getCenter(id);
    if (!c) return Infinity;
    const axisMouse = orientation === 'vertical' ? mouseY : mouseX;
    const axisCenter = orientation === 'vertical' ? c.y : c.x;
    return axisMouse - axisCenter;
  };

  const getScale = () => {
    const w = gaussian(getDistance());
    return dockTokens.size.minScale + (dockTokens.size.maxScale - 1) * w;
  };

  // Funcție pentru calcularea influenței laterale
  const getLensInfluence = () => {
    const distance = getDistance();
    const scale = getScale();

    // CORECTEZ direcția: iconul se mută DEPARTE de mouse, nu către mouse
    // Dacă mouse-ul e în stânga centrului (distance < 0), iconul se mută în dreapta (+)
    // Dacă mouse-ul e în dreapta centrului (distance > 0), iconul se mută în stânga (-)
    const direction = distance < 0 ? 1 : -1;

    // Factorul de lens - cu cât iconul e mai mare, cu atât se mută mai mult lateral
    // Iconurile se "împing" departe de cursor pentru a face loc (redus pentru efect mai subtil)
    const lensStrength = (scale - 1) * direction * 0.25;

    return lensStrength;
  };

  return { getScale, getLensInfluence };
}
