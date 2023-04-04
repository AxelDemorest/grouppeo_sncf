import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({ chartData }) {
    return <div>
        <Bar
            data={chartData}
            height={400}
            width={1150}
            options={{
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 40,
                            font: {
                                size: 20,
                            }
                        }
                    }
                }
            }}
        />
    </div>
}

export default BarChart;
