import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function Chart({ userBestGrades, isRecital }: any) {
    return (
        <ResponsiveContainer>
            <LineChart
                data={userBestGrades}
                margin={{
                    top: 30,
                    right: 30,
                    left: 30,
                    bottom: 30,
                }}
            >
                <Tooltip
                    wrapperStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        borderRadius: "12px",
                        overflow: "hidden",
                    }}
                    contentStyle={{
                        backgroundColor: "transparent",
                        border: "none",
                    }}
                    labelStyle={{
                        fontWeight: "bold",
                        color: "white",
                    }}
                    itemStyle={{ color: "white" }}
                    cursor={false}
                    formatter={(value, name) => [
                        `${isRecital ? "Recital: " : "Basic: "}${value}`,
                    ]}
                />
                <XAxis dataKey={isRecital ? "besttime" : "besttime"} hide />
                <Line
                    dataKey={isRecital ? "grade_recital" : "grade_basic"}
                    stroke="white"
                    strokeWidth={2}
                    activeDot={{
                        r: 4,
                        fill: "transparent",
                        stroke: "white",
                        strokeWidth: 1,
                    }}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
