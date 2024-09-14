import * as THREE from "three";

export function createSectorGeometry(
  platformRadius: number,
  platformWidth: number,
  startAngle: number,
  endAngle: number,
  numPoints: number
): THREE.BufferGeometry {
  const arcCurve = new THREE.ArcCurve(
    0,
    0,
    platformRadius,
    endAngle,
    startAngle,
    true
  );
  const arcPoints = arcCurve.getPoints(
    Math.round((numPoints * (endAngle - startAngle)) / (2 * Math.PI))
  );
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  arcPoints.forEach((point) => shape.lineTo(point.x, point.y));

  const extrudeSettings = { depth: platformWidth, bevelEnabled: false };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

type SectorType = "platform" | "loss" | "hole";
type Sector = [number, number, SectorType];

interface SectorConfig {
  minSize: number;
  maxSize: number;
  minCount: number;
  maxCount: number;
}

interface PlatformConfig {
  platform: SectorConfig;
  loss: SectorConfig;
  hole: SectorConfig;
}

export function generateSectors(
  index: number,
  config: PlatformConfig
): Sector[] {
  if (index === 0) {
    return [
      [0, (2 * Math.PI) / 3 - Math.PI / 12, "platform"],
      [
        (2 * Math.PI) / 3 - Math.PI / 12,
        (4 * Math.PI) / 3 - Math.PI / 6,
        "platform",
      ],
      [(4 * Math.PI) / 3 - Math.PI / 6, 2 * Math.PI - Math.PI / 4, "platform"],
      [2 * Math.PI - Math.PI / 4, 2 * Math.PI, "hole"],
    ];
  }
  const totalAngle = 2 * Math.PI;
  let currentAngle = 0;

  const getRandomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const randomizeSectorCount = (sectorConfig: SectorConfig) =>
    Math.floor(
      getRandomInRange(sectorConfig.minCount, sectorConfig.maxCount + 1)
    );

  const createSectors = (type: SectorType, count: number) => {
    const sectorArray: Sector[] = [];
    for (let i = 0; i < count; i++) {
      const sectorSize = getRandomInRange(
        config[type].minSize,
        config[type].maxSize
      );
      sectorArray.push([0, sectorSize, type]);
    }
    return sectorArray;
  };

  const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const ensureNoAdjacentSectors = (sectors: Sector[]): Sector[] => {
    for (let i = 1; i < sectors.length; i++) {
      if (sectors[i][2] === sectors[i - 1][2]) {
        for (let j = i + 1; j < sectors.length; j++) {
          if (sectors[j][2] !== sectors[i][2]) {
            [sectors[i], sectors[j]] = [sectors[j], sectors[i]];
            break;
          }
        }
      }
    }
    return sectors;
  };

  const platformCount = randomizeSectorCount(config.platform);
  const lossCount = randomizeSectorCount(config.loss);
  const holeCount = randomizeSectorCount(config.hole);

  const platformSectors = createSectors("platform", platformCount);
  const lossSectors = createSectors("loss", lossCount);
  const holeSectors = createSectors("hole", holeCount);

  const allSectors = [...platformSectors, ...lossSectors, ...holeSectors];

  const shuffledSectors = shuffleArray(allSectors);

  const validSectors = ensureNoAdjacentSectors(shuffledSectors);

  validSectors.forEach((sector) => {
    const sectorSize = sector[1];
    const nextAngle = Math.min(currentAngle + sectorSize, totalAngle);
    sector[0] = currentAngle;
    sector[1] = nextAngle;
    currentAngle = nextAngle;
    if (currentAngle >= totalAngle) return;
  });

  if (currentAngle < totalAngle) {
    validSectors.push([currentAngle, totalAngle, "platform"]);
  }

  return validSectors;
}
