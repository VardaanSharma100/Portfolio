import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const AnimationCanvas = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight

        const scene = new THREE.Scene()
        // Transparent background
        scene.background = null

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement)

        // Particle field (Stars pattern exactly like the image)
        const particlesGeometry = new THREE.BufferGeometry()
        const particlesCount = 1500
        const posArray = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount * 3; i++) {
            // Distribute stars in a wide field
            posArray[i] = (Math.random() - 0.5) * 30
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03, // Small white dots
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        })

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particlesMesh)

        // Animation loop
        let animationId
        const clock = new THREE.Clock()

        const animate = () => {
            animationId = requestAnimationFrame(animate)
            const elapsedTime = clock.getElapsedTime()

            // Barely moving particles mimicking the requested style
            particlesMesh.rotation.y = elapsedTime * 0.015
            particlesMesh.rotation.x = elapsedTime * 0.005

            // Random slight opacity pulsing
            particlesMaterial.opacity = 0.6 + (Math.sin(elapsedTime * 0.5) * 0.2)

            renderer.render(scene, camera)
        }

        animate()

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current) return

            const newWidth = containerRef.current.clientWidth
            const newHeight = containerRef.current.clientHeight

            camera.aspect = newWidth / newHeight
            camera.updateProjectionMatrix()
            renderer.setSize(newWidth, newHeight)
        }

        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)

            particlesGeometry.dispose()
            particlesMaterial.dispose()
            renderer.dispose()

            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    )
}

export default AnimationCanvas
