"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useActiveUser } from "@/context/ActiveUserContext";

interface UmapData {
  user_id: number;
  x: number;
  y: number;
  top_genre: string;
  cluster_id: number;
}

// Generate deterministic coordinates for all 568 users in clusters
const mockData: UmapData[] = Array.from({ length: 568 }).map((_, i) => {
  const cluster_id = i % 5;
  // Center clusters at different locations
  const clusterCenters = [
    { x: -5, y: -5 },
    { x: 5, y: 5 },
    { x: -5, y: 5 },
    { x: 5, y: -5 },
    { x: 0, y: 0 }
  ];
  const center = clusterCenters[cluster_id];
  // Pseudo-random offset inside the cluster
  const angle = (i * 17) % 360;
  const rad = ((i * 13) % 25) / 7;
  return {
    user_id: i + 1,
    x: center.x + Math.cos(angle) * rad,
    y: center.y + Math.sin(angle) * rad,
    top_genre: ["Sci-Fi", "Drama", "Action", "Comedy", "Romance"][cluster_id],
    cluster_id,
  };
});

const colors = ["#5b8dff", "#a78bfa", "#ff6b6b", "#f5a623", "#00d4aa"];

export function LatentSpaceMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeUserId, setActiveUserId } = useActiveUser();

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 500;

    // Clear previous
    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent")
      .style("border-radius", "16px");

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    const xScale = d3.scaleLinear().domain([-15, 15]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-15, 15]).range([height, 0]);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "absolute z-50 glass-card px-4 py-3 pointer-events-none opacity-0 transition-opacity")
      .style("position", "absolute");

    // Draw points
    g.selectAll("circle")
      .data<UmapData>(mockData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => (d.user_id === activeUserId ? 8 : 4))
      .attr("fill", (d) => (d.user_id === activeUserId ? "#ffffff" : colors[d.cluster_id]))
      .attr("stroke", (d) => (d.user_id === activeUserId ? colors[d.cluster_id] : "none"))
      .attr("stroke-width", (d) => (d.user_id === activeUserId ? 3 : 0))
      .attr("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseover", (event: MouseEvent, d) => {
        d3.select(event.currentTarget as SVGCircleElement).attr("r", d.user_id === activeUserId ? 10 : 6);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `
            <div class="text-xs font-mono text-text-muted mb-1">USER_${d.user_id}</div>
            <div class="font-semibold text-sm mb-1">${d.user_id === 943 ? "Rahul L. (Current User)" : d.user_id === activeUserId ? "Active User Context" : "Taste Cluster Profile"}</div>
            <div class="text-xs text-[${colors[d.cluster_id]}]">${d.top_genre}</div>
            <div class="text-[9px] text-text-muted mt-1">Click to select context</div>
            `
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", (event: MouseEvent, d) => {
        d3.select(event.currentTarget as SVGCircleElement).attr("r", d.user_id === activeUserId ? 8 : 4);
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("click", (_event: MouseEvent, d) => {
        setActiveUserId(d.user_id);
      })
      .transition()
      .duration(1000)
      .delay((d) => d.cluster_id * 50 + Math.random() * 200)
      .attr("opacity", (d) => (d.user_id === activeUserId ? 1 : 0.6));

    // Pulse animation for active user
    const pulseActive = () => {
      const activeNode = g.selectAll<SVGCircleElement, UmapData>("circle").filter((d) => d.user_id === activeUserId);
      if (activeNode.empty()) return;
      
      activeNode
        .transition()
        .duration(1000)
        .attr("r", 11)
        .attr("stroke-width", 1)
        .transition()
        .duration(1000)
        .attr("r", 8)
        .attr("stroke-width", 3)
        .on("end", pulseActive);
    };
    
    setTimeout(pulseActive, 1000);

    return () => {
      tooltip.remove();
    };
  }, [activeUserId, setActiveUserId]);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
