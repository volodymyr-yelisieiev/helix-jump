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
  minSize: number; // minimum sector size in radians
  maxSize: number; // maximum sector size in radians
  minCount: number; // minimum amount of this type in one platform
  maxCount: number; // maximum amount of this type in one platform
}

interface PlatformConfig {
  platform: SectorConfig;
  loss: SectorConfig;
  hole: SectorConfig;
}

export function generateSectors(config: PlatformConfig): Sector[] {
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

  // Shuffle an array using Fisher-Yates algorithm
  const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Ensure no two adjacent sectors have the same type
  const ensureNoAdjacentSectors = (sectors: Sector[]): Sector[] => {
    for (let i = 1; i < sectors.length; i++) {
      if (sectors[i][2] === sectors[i - 1][2]) {
        // Find a non-adjacent sector with a different type
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

  // Randomly generate sectors for each type
  const platformCount = randomizeSectorCount(config.platform);
  const lossCount = randomizeSectorCount(config.loss);
  const holeCount = randomizeSectorCount(config.hole);

  // Create sectors for each type
  const platformSectors = createSectors("platform", platformCount);
  const lossSectors = createSectors("loss", lossCount);
  const holeSectors = createSectors("hole", holeCount);

  // Combine all sectors into one array
  const allSectors = [...platformSectors, ...lossSectors, ...holeSectors];

  // Shuffle the sectors
  const shuffledSectors = shuffleArray(allSectors);

  // Ensure no two adjacent sectors have the same type
  const validSectors = ensureNoAdjacentSectors(shuffledSectors);

  // Assign angles to the shuffled sectors
  validSectors.forEach((sector) => {
    const sectorSize = sector[1];
    const nextAngle = Math.min(currentAngle + sectorSize, totalAngle);
    sector[0] = currentAngle; // Set start angle
    sector[1] = nextAngle; // Set end angle
    currentAngle = nextAngle;
    if (currentAngle >= totalAngle) return; // Stop if angle exceeds 2*PI
  });

  // If there is any remaining angle, fill it with a "platform" sector
  if (currentAngle < totalAngle) {
    validSectors.push([currentAngle, totalAngle, "platform"]);
  }

  return validSectors;
}

// Example usage:
const platformConfig: PlatformConfig = {
  platform: {
    minSize: Math.PI / 8,
    maxSize: Math.PI / 4,
    minCount: 1,
    maxCount: 3,
  },
  loss: {
    minSize: Math.PI / 16,
    maxSize: Math.PI / 8,
    minCount: 1,
    maxCount: 2,
  },
  hole: {
    minSize: Math.PI / 16,
    maxSize: Math.PI / 4,
    minCount: 1,
    maxCount: 2,
  },
};

const sectors = generateSectors(platformConfig);
console.log(sectors);
