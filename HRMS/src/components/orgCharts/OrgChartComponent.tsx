import React, { useEffect, useRef } from "react";
import { buildOrgChartData, type OrgChartNode } from "../../apis/OrgChartApis";
import OrgChart from "@balkangraph/orgchart.js";

interface Props {
  node: OrgChartNode;
}
const OrgChartComponent: React.FC<Props> = ({ node }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";

    const chart = new OrgChart(chartRef.current, {
      nodeBinding: {
        field_0: "name",
        field_1: "title",
      },
      nodes: [node],
      nodeContent: "title",
      pan: true,
      zoom: true,
      direction: "t2b",
      toggleSiblingsResp: false,
    });

    return () => {
      chart.destroy();
    };
  }, [node]);
  return (
    <div
      ref={chartRef}
      className="w-full h-full border border-gray-300 rounded-lg shadow-md bg-white"
    />
  );
};

export default OrgChartComponent;
