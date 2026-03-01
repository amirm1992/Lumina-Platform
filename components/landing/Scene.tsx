'use client'

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function CubeCluster() {
    const groupRef = useRef<THREE.Group>(null);

    // Slowly rotate the entire cluster
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
        }
    });

    const positions: [number, number, number][] = [];
    const size = 2;
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
                // Create a 3D cross / star shape
                if (Math.abs(x) + Math.abs(y) + Math.abs(z) <= 3) {
                    positions.push([x * 1.1, y * 1.1, z * 1.1]);
                }
            }
        }
    }

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={groupRef} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                {positions.map((pos, i) => (
                    <RoundedBox key={i} position={pos} args={[1, 1, 1]} radius={0.15} smoothness={4}>
                        <meshPhysicalMaterial
                            color="#0066ff"
                            emissive="#0022ff"
                            emissiveIntensity={0.4}
                            transmission={0.9}
                            opacity={1}
                            metalness={0.1}
                            roughness={0.1}
                            ior={1.5}
                            thickness={1.5}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </RoundedBox>
                ))}
            </group>
        </Float>
    );
}

export function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }} className="w-full h-full">
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Suspense fallback={null}>
                <CubeCluster />
                <Environment preset="city" />
                <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    );
}
