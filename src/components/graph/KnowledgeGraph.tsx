import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SourceItem, EntityItem, RelationshipItem } from '../../types/spider';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Search } from 'lucide-react';

interface KnowledgeGraphProps {
  sources: SourceItem[];
  entities: EntityItem[];
  relationships: RelationshipItem[];
  onSelectNode?: (node: any) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  relevance?: number;
  mentions?: number;
  domain?: string;
  radius: number;
  color: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  type: string;
  weight: number;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  sources,
  entities,
  relationships,
  onSelectNode,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    // Build Nodes
    const rawNodes: GraphNode[] = [
      ...sources.map(s => ({
        id: s.id,
        name: s.title,
        type: 'SOURCE',
        domain: s.domain,
        radius: 14,
        color: '#38BDF8', // Sky Blue
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height / 2 + (Math.random() - 0.5) * 200,
      })),
      ...entities.map(e => ({
        id: e.id,
        name: e.name,
        type: e.type,
        mentions: e.mentions,
        relevance: e.relevance,
        radius: Math.min(22, 9 + (e.mentions || 1) * 2),
        color:
          e.type === 'METHODOLOGY'
            ? '#A855F7' // Purple
            : e.type === 'TOPIC'
            ? '#EC4899' // Pink
            : e.type === 'PERSON'
            ? '#F59E0B' // Amber
            : '#06B6D4', // Cyan (Concept)
        x: width / 2 + (Math.random() - 0.5) * 300,
        y: height / 2 + (Math.random() - 0.5) * 300,
      })),
    ];

    // Filter nodes if needed
    const nodeMap = new Map<string, GraphNode>();
    rawNodes.forEach(n => {
      const matchFilter = filterType === 'ALL' || n.type === filterType;
      const matchSearch = !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (matchFilter && matchSearch) {
        nodeMap.set(n.id, n);
      }
    });

    const activeNodes = Array.from(nodeMap.values());

    // Build Links
    const activeLinks: GraphLink[] = [];
    relationships.forEach(rel => {
      if (nodeMap.has(rel.source) && nodeMap.has(rel.target)) {
        activeLinks.push({
          id: rel.id,
          source: rel.source,
          target: rel.target,
          type: rel.type,
          weight: rel.weight || 1,
        });
      }
    });

    // D3 Simulation setup
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Forces
    const simulation = d3.forceSimulation<GraphNode>(activeNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(activeLinks).id(d => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 12));

    // Draw Links (Glowing threads)
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(activeLinks)
      .enter()
      .append('line')
      .attr('stroke', '#06B6D4')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', d => Math.max(1, (d.weight || 0.8) * 1.8))
      .attr('stroke-dasharray', d => (d.type === 'RELATED_TO' ? '4 2' : 'none'));

    // Draw Nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(activeNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer ripple halo
    node.append('circle')
      .attr('r', d => d.radius + 4)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3);

    // Node main circle
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', '#0E1217')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);

    // Center icon or dot
    node.append('circle')
      .attr('r', 3)
      .attr('fill', d => d.color);

    // Labels
    node.append('text')
      .text(d => (d.name.length > 20 ? d.name.slice(0, 18) + '...' : d.name))
      .attr('x', d => d.radius + 5)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#E2E8F0')
      .attr('pointer-events', 'none');

    // Click handler
    node.on('click', (event, d) => {
      setSelectedNode(d);
      onSelectNode?.(d);
    });

    // Simulation ticks
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [sources, entities, relationships, filterType, searchQuery]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#08090B] overflow-hidden select-none">
      {/* Top Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#101216] border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Filter size={13} />
            <span>FILTER:</span>
          </div>
          <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded border border-white/5">
            {['ALL', 'SOURCE', 'CONCEPT', 'METHODOLOGY', 'TOPIC'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  filterType === t
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Node Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/40 border border-white/10 rounded px-2 py-0.5 text-xs">
            <Search size={12} className="text-slate-400 mr-1.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search graph entities..."
              className="bg-transparent text-xs text-white placeholder-slate-500 outline-none font-mono w-36 sm:w-48"
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            <span>{entities.length} entities</span>
            <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
            <span>{relationships.length} connections</span>
          </div>
        </div>
      </div>

      {/* Main SVG Graph Canvas */}
      <div className="relative flex-1 w-full h-full">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing tech-grid" />

        {/* Selected Node Inspector Flyout */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 max-w-sm p-4 rounded-lg bg-[#101216]/95 border border-white/10 shadow-2xl backdrop-blur-md z-20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">
                {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm font-semibold text-white">{selectedNode.name}</h4>
            {selectedNode.mentions !== undefined && (
              <p className="text-xs font-mono text-slate-400">
                Mentions across crawl: {selectedNode.mentions}
              </p>
            )}
            {selectedNode.domain && (
              <p className="text-xs font-mono text-cyan-400">
                Domain: {selectedNode.domain}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
