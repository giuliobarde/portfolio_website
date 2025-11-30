"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Shapes(){
    return (
        <div className="row-span-1 row-start-1 -mt-4 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas 
                className="z-0" 
                shadows 
                gl={{antialias:false}} 
                dpr={[1, 1.5]} 
                camera={{
                    position: [0, 0, 25], 
                    fov:30, 
                    near:1, 
                    far:40
                }}
            >
                <Suspense fallback={null}>
                    <Geometries />
                    <ContactShadows
                        position={[0, -3.5, 0]}
                        opacity={0.65}
                        scale={40}
                        blur={1}
                        far={9} />
                    <Environment preset="studio" />
                </Suspense>
            </Canvas>
        </div>
    )
}

function Geometries() {
    const geometries = [
        {
            position: [0, 0, 0],
            r: 0.3,
            geometry: new THREE.BoxGeometry(2.5, 2.5, 0.3), // Code block / Terminal window
            wireframe: true,
        },
        {
            position: [1.6,1.6,-4],
            r: 0.5,
            geometry: new THREE.OctahedronGeometry(1.2), // Network node / Data structure
            wireframe: true,
        },
        {
            position: [-0.8, -0.5, 5],
            r: 1,
            geometry: new THREE.TetrahedronGeometry(1.1), // Algorithm flow / Data processing
            wireframe: true,
        },
        {
            position: [1,-0.75,4],
            r: 0.7,
            geometry: new THREE.BoxGeometry(1.2, 1.2, 1.2), // Code bracket / Block
            wireframe: true,
        },
        {
            position: [-1.4, 2, -4],
            r: 1,
            geometry: new THREE.IcosahedronGeometry(1.2), // Circuit pattern / Chip
            wireframe: true,
        },
        {
            position: [0.5, -1.5, 3],
            r: 0.6,
            geometry: new THREE.CylinderGeometry(0.4, 0.4, 2, 8), // Binary digit / Data stream
            wireframe: true,
        },
    ];

    const wireframeMaterials = [
        new THREE.MeshStandardMaterial({ color:0x00d4ff, wireframe: true, emissive:0x00d4ff, emissiveIntensity:0.5 }),
        new THREE.MeshStandardMaterial({ color:0x00ff88, wireframe: true, emissive:0x00ff88, emissiveIntensity:0.5 }),
        new THREE.MeshStandardMaterial({ color:0x4a90e2, wireframe: true, emissive:0x4a90e2, emissiveIntensity:0.5 }),
        new THREE.MeshStandardMaterial({ color:0xff6b6b, wireframe: true, emissive:0xff6b6b, emissiveIntensity:0.5 }),
        new THREE.MeshStandardMaterial({ color:0xffd93d, wireframe: true, emissive:0xffd93d, emissiveIntensity:0.5 }),
        new THREE.MeshStandardMaterial({ color:0x9b59b6, wireframe: true, emissive:0x9b59b6, emissiveIntensity:0.5 }),
    ];

    return geometries.map(({position, r, geometry, wireframe}, index) => (
        <Geometry 
            key={JSON.stringify(position)}
            position={position.map((p) => p*2)}
            geometry={geometry}
            materials={wireframeMaterials}
            wireframe={wireframe}
            r={r}
        />
    ))
}

function Geometry({r, position, geometry, materials, wireframe}){
    const meshRef = useRef()
    const [visible, setVisible] = useState(false)

    const startingMaterial = getRandomMaterial()

    function getRandomMaterial(){
        return gsap.utils.random(materials)
    }

    function handleClick(e) {
        const mesh = e.object;
    
        // Rotation animation (existing)
        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0,2)}`,
            y: `+=${gsap.utils.random(0,2)}`,
            z: `+=${gsap.utils.random(0,2)}`,
            duration: 1.3,
            yoyo: true,
        });
    
        mesh.material = getRandomMaterial();
    
        // Small bounce effect on click
        gsap.to(mesh.position, {
            y: `+=0.7`, // Move up slightly
            duration: 0.4,
            ease: "power2.out",
            yoyo: true,
            repeat: 1, // Moves back down
            onComplete: () => {
                // Secondary bounce effect on landing
                gsap.to(mesh.position, {
                    y: `+=0.3`,
                    duration: 0.2,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }    

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer";
    };
    
    const handlePointerOut = () => {
        document.body.style.cursor = "default";
    };
    
    useEffect(() => {
        let ctx = gsap.context(() => {
            setVisible(true)

            gsap.fromTo(meshRef.current.position, 
                { y: position[1] + 10 }, // Start from above
                { 
                    y: position[1], // End at original position
                    duration: 1.5, 
                    ease: "bounce.out",
                    delay: gsap.utils.random(0.1, 0.5) // Slight delay for variation
                }
            );

            gsap.from(meshRef.current.scale,
                {
                    x:0,
                    y:0,
                    z:0,
                    duration: 1,
                    ease: "elastic.out(1,0.3)",
                    delay: 0.3,
                })
        })
        return () => ctx.revert()
    }, [])

    return (
        <group position={position} ref={meshRef}>
            <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                <mesh 
                    geometry={geometry}
                    onClick={handleClick}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    visible={visible}
                    material={startingMaterial}
                    rotation={[Math.PI / 4, Math.PI / 4, 0]}
                />
            </Float>
        </group>
    )
}