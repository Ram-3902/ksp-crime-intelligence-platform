import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { api } from "../api/endpoints";
import type { NetworkNodeData, NetworkLinkData } from "../types";
import * as d3 from "d3";

export const Network: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<NetworkNodeData[]>([]);
  const [links, setLinks] = useState<NetworkLinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getNetworkGraph();
        const formattedLinks = res.links.map((l: any) => ({
          ...l,
          source: l.source || l.source_id,
          target: l.target || l.target_id,
        }));
        setNodes(res.nodes);
        setLinks(formattedLinks);
      } catch (err) {
        console.error("Network fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || !nodes.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 500;

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links as any)
          .id((d: any) => d.node_id)
          .distance(90)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const g = svg.append("g");

    // Add zoom
    svg.call(
      d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any
    );

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) =>
        d.label === "Co-accused" ? "#c0392b" : d.label === "Victim" ? "#1a7a4a" : "#b0bbcb"
      )
      .attr("stroke-width", (d) => d.weight || 1.5)
      .attr("stroke-dasharray", (d) => (d.label === "Associate" ? "4,4" : "none"));

    // Nodes
    const node = g
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.node_type === "suspect" ? 14 : d.node_type === "victim" ? 10 : 12))
      .attr("fill", (d) =>
        d.node_type === "suspect"
          ? d.risk && d.risk >= 8
            ? "#fee2e2"
            : "#dbeafe"
          : d.node_type === "victim"
          ? "#d1fae5"
          : "#ede9fe"
      )
      .attr("stroke", (d) =>
        d.node_type === "suspect"
          ? d.risk && d.risk >= 8
            ? "#c0392b"
            : "#1d5cbe"
          : d.node_type === "victim"
          ? "#1a7a4a"
          : "#5b21b6"
      )
      .attr("stroke-width", 2);

    // Labels
    const label = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("dx", 14)
      .attr("dy", 4)
      .attr("fill", "#1a2332");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });
  }, [loading, nodes, links]);

  return (
    <Layout
      title="Criminal Network & Link Analysis"
      subtitle="Force-directed relationship mapping — suspects, victims, gangs, and crime scenes"
    >
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h4>🔗 Suspect-Victim-Location Force Graph</h4>
          <span className="card-badge badge-cyan">D3 Force Layout</span>
        </div>
        <svg ref={svgRef} style={{ width: "100%", height: 500, background: "#f7f9fc" }} />
      </div>
    </Layout>
  );
};
