"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Globe parameters
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.3

    // Create points on the globe
    const points = []
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      points.push({
        theta,
        phi,
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        size: Math.random() * 2 + 1,
      })
    }

    // Animation
    let animationFrameId: number
    let rotation = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Rotate the globe
      rotation += 0.001

      // Draw points
      points.forEach((point) => {
        // Apply rotation
        const rotatedX = point.x * Math.cos(rotation) - point.z * Math.sin(rotation)
        const rotatedZ = point.x * Math.sin(rotation) + point.z * Math.cos(rotation)

        // Project 3D to 2D
        const scale = 400 / (400 + rotatedZ)
        const x2d = centerX + rotatedX * scale
        const y2d = centerY + point.y * scale

        // Only draw points on the front half of the globe
        if (rotatedZ < 0) {
          const alpha = Math.max(0.1, -rotatedZ / radius)
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
          ctx.beginPath()
          ctx.arc(x2d, y2d, point.size * scale, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
