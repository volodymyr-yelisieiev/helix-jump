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
    Math.ceil((numPoints * (endAngle - startAngle)) / (2 * Math.PI))
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
  const MAX_SECTOR_SIZE = Math.PI;

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

  const createSectors = (type: SectorType, count: number) =>
    Array.from({ length: count }, () => {
      let sectorSize = Math.min(
        getRandomInRange(config[type].minSize, config[type].maxSize),
        MAX_SECTOR_SIZE
      );
      return [0, sectorSize, type] as Sector;
    });

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
        const nextDiffIndex = sectors.findIndex(
          (sec, j) => sec[2] !== sectors[i][2] && j > i
        );
        if (nextDiffIndex !== -1) {
          [sectors[i], sectors[nextDiffIndex]] = [
            sectors[nextDiffIndex],
            sectors[i],
          ];
        }
      }
    }

    // Check for circular adjacency between first and last sectors
    if (
      sectors.length > 1 &&
      sectors[0][2] === sectors[sectors.length - 1][2]
    ) {
      const nextDiffIndex = sectors.findIndex(
        (sec, j) => sec[2] !== sectors[0][2] && j > 0
      );
      if (nextDiffIndex !== -1) {
        [sectors[0], sectors[nextDiffIndex]] = [
          sectors[nextDiffIndex],
          sectors[0],
        ];
      }
    }

    return sectors;
  };

  const platformCount = randomizeSectorCount(config.platform);
  const lossCount = randomizeSectorCount(config.loss);
  const holeCount = randomizeSectorCount(config.hole);

  const allSectors = [
    ...createSectors("platform", platformCount),
    ...createSectors("loss", lossCount),
    ...createSectors("hole", holeCount),
  ];

  const validSectors = ensureNoAdjacentSectors(shuffleArray(allSectors));

  validSectors.forEach((sector) => {
    const sectorSize = Math.min(sector[1], MAX_SECTOR_SIZE);
    const nextAngle = Math.min(currentAngle + sectorSize, totalAngle);
    sector[0] = currentAngle;
    sector[1] = nextAngle;
    currentAngle = nextAngle;
  });

  if (currentAngle < totalAngle) {
    validSectors.push([currentAngle, totalAngle, "platform"]);
  }

  const flattenedSectors: Sector[] = validSectors.flatMap((sector) => {
    const [startAngle, endAngle, sectorType] = sector;
    if (endAngle - startAngle > MAX_SECTOR_SIZE) {
      const middleAngle = startAngle + MAX_SECTOR_SIZE;
      return [
        [startAngle, middleAngle, sectorType],
        [middleAngle, endAngle, sectorType],
      ];
    }
    return [[startAngle, endAngle, sectorType]];
  });

  return flattenedSectors.filter((sector) => sector[1] - sector[0] >= 0.01);
}
