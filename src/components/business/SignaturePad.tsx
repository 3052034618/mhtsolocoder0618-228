import * as React from "react"
import { motion } from "framer-motion"
import { Eraser, Undo2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export interface SignaturePadProps {
  onConfirm?: (signatureData: string) => void
  onCancel?: () => void
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  className?: string
}

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
  width: number
}

export const SignaturePad = React.forwardRef<HTMLCanvasElement, SignaturePadProps>(
  (
    {
      onConfirm,
      onCancel,
      width = 480,
      height = 200,
      strokeColor = "#1E3A5F",
      strokeWidth = 2.5,
      className,
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = React.useState(false)
    const [strokes, setStrokes] = React.useState<Stroke[]>([])
    const [currentStroke, setCurrentStroke] = React.useState<Stroke | null>(null)

    React.useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

    const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      if ("touches" in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }

    const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
      if (stroke.points.length < 2) return
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    }

    const redraw = React.useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#FAFAF9"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#E7E5E4"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(20, height - 30)
      ctx.lineTo(width - 20, height - 30)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "#A8A29E"
      ctx.font = "14px 'Noto Sans SC', sans-serif"
      ctx.fillText("在此处签名", 24, height - 45)

      strokes.forEach((stroke) => drawStroke(ctx, stroke))
      if (currentStroke) {
        drawStroke(ctx, currentStroke)
      }
    }, [strokes, currentStroke, width, height])

    React.useEffect(() => {
      redraw()
    }, [redraw])

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      const point = getCanvasPoint(e)
      setIsDrawing(true)
      setCurrentStroke({
        points: [point],
        color: strokeColor,
        width: strokeWidth,
      })
    }

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !currentStroke) return
      e.preventDefault()
      const point = getCanvasPoint(e)
      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, point],
      })
    }

    const handleEnd = () => {
      if (!isDrawing || !currentStroke) return
      setIsDrawing(false)
      if (currentStroke.points.length > 1) {
        setStrokes((prev) => [...prev, currentStroke])
      }
      setCurrentStroke(null)
    }

    const handleClear = () => {
      setStrokes([])
      setCurrentStroke(null)
    }

    const handleUndo = () => {
      setStrokes((prev) => prev.slice(0, -1))
    }

    const handleConfirm = () => {
      const canvas = canvasRef.current
      if (!canvas || strokes.length === 0) return
      const dataUrl = canvas.toDataURL("image/png")
      onConfirm?.(dataUrl)
    }

    const hasSignature = strokes.length > 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("flex flex-col gap-4", className)}
      >
        <div className="relative rounded-xl border-2 border-dashed border-neutral-300 overflow-hidden bg-neutral-50">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full cursor-crosshair touch-none"
            style={{ aspectRatio: `${width}/${height}` }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={strokes.length === 0}
              leftIcon={<Undo2 className="h-4 w-4" />}
            >
              撤销
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={strokes.length === 0}
              leftIcon={<Eraser className="h-4 w-4" />}
            >
              清空
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                leftIcon={<X className="h-4 w-4" />}
              >
                取消
              </Button>
            )}
            <Button
              variant="gold"
              size="sm"
              onClick={handleConfirm}
              disabled={!hasSignature}
              leftIcon={<Check className="h-4 w-4" />}
            >
              确认签名
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }
)

SignaturePad.displayName = "SignaturePad"
