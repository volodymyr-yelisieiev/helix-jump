import * as THREE from "three";

export const createSectorGeometry = (
  platformRadius: number,
  platformWidth: number,
  startAngle: number,
  endAngle: number,
  numPoints: number
): THREE.BufferGeometry => {
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
};

export const generateSectors = (
  index: number,
  numPoints: number = 32
): [number, number, "loss" | "hole" | "platform"][] => {
  const sectorsList: [number, number, "loss" | "hole" | "platform"][] = [];
  const numHoles = Math.floor(Math.random() * 3) + 1;
  const anglePerSector = (2 * Math.PI) / numPoints;

  const offsetAngle = Math.floor(Math.random() * numPoints) * anglePerSector;

  let currentAngle = offsetAngle;
  let remainingAngle = 2 * Math.PI;

  const holeStructureAngle = (): number => {
    const holeSize = Math.floor(Math.random() * 2) + 2;
    return (holeSize + 2) * anglePerSector;
  };

  const addHoleStructure = () => {
    const holeSize = Math.floor(Math.random() * 2) + 2;

    sectorsList.push([currentAngle, currentAngle + anglePerSector, "loss"]);
    currentAngle += anglePerSector;
    remainingAngle -= anglePerSector;

    const holeAngle = holeSize * anglePerSector;
    sectorsList.push([currentAngle, currentAngle + holeAngle, "hole"]);
    currentAngle += holeAngle;
    remainingAngle -= holeAngle;

    sectorsList.push([currentAngle, currentAngle + anglePerSector, "loss"]);
    currentAngle += anglePerSector;
    remainingAngle -= anglePerSector;
  };

  if (index === 0) {
    return [
      [0, 2 * Math.PI - Math.PI / 4, "platform"],
      [2 * Math.PI - Math.PI / 4, 2 * Math.PI, "hole"],
    ];
  }

  for (let i = 0; i < numHoles; i++) {
    const maxPlatformAngle = Math.min(
      Math.floor(Math.random() * numPoints) * anglePerSector,
      remainingAngle - 5 * anglePerSector
    );

    if (remainingAngle >= holeStructureAngle()) {
      addHoleStructure();
    }

    if (maxPlatformAngle > 0 && i < numHoles - 1) {
      sectorsList.push([
        currentAngle,
        currentAngle + maxPlatformAngle,
        "platform",
      ]);
      currentAngle += maxPlatformAngle;
      remainingAngle -= maxPlatformAngle;
    }
  }

  if (remainingAngle > 0) {
    sectorsList.push([currentAngle, 2 * Math.PI + offsetAngle, "platform"]);
  }

  return sectorsList;
};
