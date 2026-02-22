import React, { useEffect, useRef } from "react";
import { buildOrgChartData, type OrgChartNode } from "../../apis/OrgChartApis";
import OrgChart from "@balkangraph/orgchart.js";

interface Props {
  nodes: OrgChartNode[];
  onNodeClick: (id: number) => void;
}
const OrgChartComponent: React.FC<Props> = ({ nodes, onNodeClick }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";

    OrgChart.templates.professional = Object.assign({}, OrgChart.templates.ana);

    OrgChart.templates.professional.size = [250, 80];

    OrgChart.templates.professional.node = `<rect x="0" y="0" width="250" height="80"
        rx="10" ry="10"
        fill="#ffffff"
        stroke="#e5e7eb"
        stroke-width="1">
       </rect>`;

    OrgChart.templates.professional.field_0 = `<text x="125" y="30"
        text-anchor="middle"
        style="font-size:16px;font-weight:600;fill:#111827">
        {val}
      </text>`;

    OrgChart.templates.professional.field_1 = `<text x="125" y="55"
        text-anchor="middle"
        style="font-size:13px;fill:#6b7280">
        {val}
      </text>`;

    const chart = new OrgChart(chartRef.current, {
      template: "professional",

      nodeBinding: {
        field_0: "name",
        field_1: "title",
      },

      nodeMouseClick: OrgChart.action.select,

      nodes: nodes,
      collapse: {
        level: 2,
      },

      toolbar: {
        zoom: true,
        fit: true,
        expandAll: true,
      },
    });

    chart.on("click", (sender, args) => {
      if (args.node) {
        const clickedId = args.node.id;

        onNodeClick(clickedId);
      }
    });

    return () => {
      chart.destroy();
    };
  }, [nodes]);
  return (
    <div
      ref={chartRef}
      className="w-full h-[600px] border border-gray-300 rounded-lg shadow-md bg-gray"
    />
  );
};

export default OrgChartComponent;
