'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ProductsByCategoryChartProps {
    data: { name: string; value: number }[]
}

const COLORS = [
    'hsl(221.2 83.2% 53.3%)', // Primary blue
    'hsl(210 40% 96%)',       // Secondary light
    'hsl(217.2 91.2% 59.8%)', // Accent blue
    'hsl(215.4 16.3% 46.9%)', // Muted
    'hsl(0 84.2% 60.2%)',     // Destructive red
    'hsl(142.1 76.2% 36.3%)', // Success green
]

export function ProductsByCategoryChart({ data }: ProductsByCategoryChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                No category data available
            </div>
        )
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ categoryName, productCount }) => `${categoryName}: ${productCount}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="productCount"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name) => [value, 'Products']}
                        labelFormatter={(label) => `Category: ${label}`}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
