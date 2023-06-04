import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({ chartData }) {
    return <div>
        <Bar
            data={chartData}
            height={400}
            options={{
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 40,
                            font: {
                                size: 14,
                            }
                        }
                    }
                }
            }}
        />
    </div>
}

export default BarChart;
