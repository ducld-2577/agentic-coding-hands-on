'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as d3 from 'd3'
import type { SpotlightNode } from '@/lib/kudos/types'
import { KudosSpotlightTooltip } from './kudos-spotlight-tooltip'

interface KudosSpotlightBoardProps {
  nodes: SpotlightNode[]
  totalKudosCount: number
}

interface TooltipState {
  node: SpotlightNode
  x: number
  y: number
}

interface SimNode extends SpotlightNode, d3.SimulationNodeDatum {}

export function KudosSpotlightBoard({ nodes, totalKudosCount }: KudosSpotlightBoardProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, undefined> | null>(null)
  const dragBehaviorRef = useRef<d3.DragBehavior<SVGGElement, unknown, unknown> | null>(null)
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [dimensions, setDimensions] = useState({ width: 800, height: 548 })
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [mode, setMode] = useState<'pan' | 'zoom'>('pan')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      setDimensions({ width, height: 548 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const getNodeOpacity = useCallback(
    (node: SimNode, maxCount: number): number => {
      const base = 0.5 + (node.kudos_count / Math.max(maxCount, 1)) * 0.5
      if (!debouncedQuery) return base
      return node.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ? base : 0.15
    },
    [debouncedQuery]
  )

  const getFontSize = useCallback((count: number, maxCount: number): number => {
    return Math.max(10, Math.min(28, 10 + (count / Math.max(maxCount, 1)) * 18))
  }, [])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    const { width, height } = dimensions
    const maxCount = Math.max(...nodes.map((n) => n.kudos_count), 1)

    svg.selectAll('g.canvas-group').remove()

    const g = svg.append('g').attr('class', 'canvas-group')

    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }))

    const simulation = d3
      .forceSimulation(simNodes)
      .force('charge', d3.forceManyBody().strength(-30))
      .force('collide', d3.forceCollide((d) => getFontSize((d as SimNode).kudos_count, maxCount) * 3))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .alphaDecay(0.05)

    simulationRef.current = simulation

    const texts = g
      .selectAll<SVGTextElement, SimNode>('text')
      .data(simNodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-weight', '600')
      .style('cursor', 'pointer')
      .style('user-select', 'none')

    simulation.on('tick', () => {
      texts
        .attr('x', (d) => d.x ?? width / 2)
        .attr('y', (d) => d.y ?? height / 2)
        .attr('font-size', (d) => getFontSize(d.kudos_count, maxCount))
        .attr('fill', 'white')
        .attr('opacity', (d) => getNodeOpacity(d, maxCount))
        .text((d) => d.name)
    })

    simulation.on('end', () => setLoading(false))

    texts
      .on('mouseenter', function (event: MouseEvent, d: SimNode) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        setTooltip({ node: d, x: event.clientX - rect.left, y: event.clientY - rect.top })
      })
      .on('mousemove', function (event: MouseEvent, d: SimNode) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        setTooltip({ node: d, x: event.clientX - rect.left, y: event.clientY - rect.top })
      })
      .on('mouseleave', () => setTooltip(null))
      .on('click', (_event: MouseEvent, d: SimNode) => {
        router.push(`/sun-kudos?receiver=${d.id}`)
      })

    const dragBehavior = d3
      .drag<SVGGElement, unknown>()
      .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, unknown>) => {
        const current = g.attr('transform') ?? 'translate(0,0)'
        const match = current.match(/translate\(([^,]+),([^)]+)\)/)
        const tx = match ? parseFloat(match[1]) : 0
        const ty = match ? parseFloat(match[2]) : 0
        g.attr('transform', `translate(${tx + event.dx},${ty + event.dy})`)
      })

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString())
      })

    dragBehaviorRef.current = dragBehavior
    zoomBehaviorRef.current = zoomBehavior

    if (mode === 'pan') {
      svg.on('.zoom', null)
      svg.select<SVGGElement>('g.canvas-group').call(dragBehavior)
    } else {
      svg.select<SVGGElement>('g.canvas-group').on('.drag', null)
      svg.call(zoomBehavior)
    }

    return () => {
      simulation.stop()
      svg.on('.zoom', null)
    }
  }, [nodes, dimensions, getFontSize, getNodeOpacity, mode, router])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const g = svg.select<SVGGElement>('g.canvas-group')

    if (mode === 'pan') {
      svg.on('.zoom', null)
      if (dragBehaviorRef.current) g.call(dragBehaviorRef.current)
    } else {
      g.on('.drag', null)
      if (zoomBehaviorRef.current) svg.call(zoomBehaviorRef.current)
    }
  }, [mode])

  useEffect(() => {
    if (!simulationRef.current) return
    const maxCount = Math.max(...nodes.map((n) => n.kudos_count), 1)
    const svg = d3.select(svgRef.current)
    svg.selectAll<SVGTextElement, SimNode>('text').attr('opacity', (d) => getNodeOpacity(d, maxCount))
  }, [debouncedQuery, nodes, getNodeOpacity])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '548px', backgroundColor: '#051825' }}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center gap-2 bg-[#0a2233] rounded-md px-3 py-1.5" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm"
            className="bg-transparent text-white text-sm outline-none placeholder:text-white/40 w-32"
          />
        </div>

        <div className="text-center">
          <span className="font-montserrat font-bold text-[#F5C842]" style={{ fontSize: '28px', letterSpacing: '2px' }}>
            {totalKudosCount.toLocaleString()} KUDOS
          </span>
        </div>

        <button
          onClick={() => setMode((m) => (m === 'pan' ? 'zoom' : 'pan'))}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: mode === 'zoom' ? '#F5C842' : 'rgba(255,255,255,0.7)',
          }}
          aria-label={mode === 'pan' ? 'Chuyển sang zoom' : 'Chuyển sang pan'}
        >
          {mode === 'pan' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 10l-4 4M10 6l4-4M2 6V2h4M10 14h4v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {mode === 'pan' ? 'Pan' : 'Zoom'}
        </button>
      </div>

      {/* SVG canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height="548"
        className="block"
        style={{ paddingTop: '56px' }}
      />

      {/* Loading overlay */}
      {loading && nodes.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#051825]/80 z-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#F5C842] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <p className="text-white/50 text-base">Chưa có dữ liệu</p>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && <KudosSpotlightTooltip node={tooltip.node} x={tooltip.x} y={tooltip.y} />}
    </div>
  )
}
