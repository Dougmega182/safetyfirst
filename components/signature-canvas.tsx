// safetyfirst/components/signature-canvas.tsx
"use client"

import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Eraser, Save } from "lucide-react"

interface SignatureCanvasProps {
  onSave: (signature: string | null) => void
}

export default function SignatureCanvas({ onSave }: Readonly<SignatureCanvasProps>): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Handle mobile detection directly in the component
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 200

    // Set up context
    context.lineWidth = 2
    context.lineCap = "round"
    context.strokeStyle = "#000"
    setCtx(context)

    // Handle window resize
    const handleResize = () => {
      if (!canvas || !context) return

      // Save current drawing
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      tempCtx.drawImage(canvas, 0, 0)

      // Resize canvas
      canvas.width = canvas.offsetWidth
      canvas.height = 200

      // Restore drawing
      context.lineWidth = 2
      context.lineCap = "round"
      context.strokeStyle = "#000"
      context.drawImage(tempCanvas, 0, 0)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return

    setIsDrawing(true)
    ctx.beginPath()

    // Get coordinates
    const { offsetX, offsetY } = getCoordinates(e)
    ctx.moveTo(offsetX, offsetY)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return

    // Get coordinates
    const { offsetX, offsetY } = getCoordinates(e)
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!ctx) return

    setIsDrawing(false)
    ctx.closePath()
  }

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { offsetX: 0, offsetY: 0 }

    let offsetX, offsetY

    if (isTouchEvent(e)) {
      // Touch event
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0] || e.changedTouches[0]
      offsetX = touch.clientX - rect.left
      offsetY = touch.clientY - rect.top
    } else {
      // Mouse event
      offsetX = e.nativeEvent.offsetX
      offsetY = e.nativeEvent.offsetY
    }

    return { offsetX, offsetY }
  }

  const isTouchEvent = (e: React.MouseEvent | React.TouchEvent): e is React.TouchEvent => {
    return "touches" in e
  }

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onSave(null)
  }

  const saveSignature = () => {
    if (!canvasRef.current) return

    const dataUrl = canvasRef.current.toDataURL("image/png")
    onSave(dataUrl)
  }

  return (
    <div className="space-y-2">
      <div className="border rounded-md bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          <Eraser className="h-4 w-4 mr-2" /> Clear
        </Button>
        <Button size="sm" onClick={saveSignature}>
          <Save className="h-4 w-4 mr-2" /> Save Signature
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {isMobile ? "Use your finger to sign above" : "Use your mouse to sign above"}
      </p>
    </div>
  )
}


