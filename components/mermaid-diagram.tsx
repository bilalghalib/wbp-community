'use client'

import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
})

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      mermaid.contentLoaded()
    }
  }, [chart])

  return (
    <div className="mermaid flex justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 my-6 overflow-x-auto">
      {chart}
    </div>
  )
}
