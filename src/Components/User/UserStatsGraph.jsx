import React from "react";
import styles from "./UserStatsGraph.module.css";
import { VictoryPie, VictoryChart, VictoryBar } from "victory";

const UserStatsGraph = ({ data }) => {
  const [graph, setGraph] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  function randomRgbaString(alpha) {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let a = alpha;
    return `rgba(${r},${g},${b},${a})`;
  }

  React.useEffect(() => {
    const graphData = data.map((item) => {
      return {
        x: item.title,
        y: Number(item.acessos),
      };
    });

    graphData.sort((a, b) => b.y - a.y);

    // Pegue apenas os 5 primeiros elementos do array (os maiores acessos)
    const top5Data = graphData.slice(0, 5);

    setTotal(
      data.map(({ acessos }) => Number(acessos)).reduce((a, b) => a + b, 0)
    );

    setGraph(top5Data);
  }, [data]);

  return (
    <section className={`${styles.graph} animeLeft`}>
      <div className={`${styles.total} ${styles.graphItem}`}>
        <p>
          Acessos : <span>{total}</span>
        </p>
      </div>
      <div className={styles.graphItem}>
        <VictoryPie
          domain={{ x: [0, 100], y: [0, 1] }}
          data={graph}
          innerRadius={50}
          padding={{ top: 20, bottom: 20, left: 80, right: 80 }}
          style={{
            data: {
              fillOpacity: 0.9,
              stroke: "#f2f2f2",
              strokeWidth: 2,
              fill: randomRgbaString(1),
            },
            labels: {
              fontSize: 18,
              fill: "#333",
            },
          }}
        />
      </div>
      <div className={`${styles.graphItem} ${styles.graphScale}`}>
        <VictoryChart>
          <VictoryBar
            alignment="start"
            data={graph}
            style={{
              data: { fill: randomRgbaString(1) },
            }}
          ></VictoryBar>
        </VictoryChart>
      </div>
    </section>
  );
};

export default UserStatsGraph;
