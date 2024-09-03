
"use client";
import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { ItemInterface } from "./InventoryTable";


const COLORS = ["#0088FE", "#00C49F", "#74d6e3","#FF6384", "#FF8042", "#FFBB28","#a257b5","#d2f763","#ffc58f",  "#6db557"];

export default function InventoryPieChart({ items }: { items: ItemInterface[] }) {
  // Prepare the data for the Pie Chart
  const data = items.map((item) => ({
    name: item.name,
    value: parseInt(item.quantity),
  }));

  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
