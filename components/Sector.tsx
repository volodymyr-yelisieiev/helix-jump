import {createSectorGeometry} from '@/utils/geometryUtils'

export default function Sector({
                                   platformRadius,
                                   poleRadius,
                                   platformWidth,
                                   startAngle,
                                   endAngle,
                                   isVisible,
                                   color,
                                   numPoints
                               }: {
    platformRadius: number;
    poleRadius: number;
    platformWidth: number;
    startAngle: number;
    endAngle: number;
    isVisible: boolean;
    color: string;
    numPoints: number;
}) {
    return (<mesh
        geometry={createSectorGeometry(platformRadius, poleRadius, platformWidth, startAngle, endAngle, numPoints)}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={isVisible}
    >
        <meshStandardMaterial color={color}/>
    </mesh>)
};
