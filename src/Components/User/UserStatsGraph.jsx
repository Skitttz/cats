import React from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryPie,
  VictoryTooltip,
} from 'victory';
import styles from './UserStatsGraph.module.css';

const UserStatsGraph = ({ data }) => {
  const [graph, setGraph] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const colorPalette = [
    '#6366f1',
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#84cc16',
    '#f97316',
    '#6b7280',
  ];

  function getColor(index) {
    return colorPalette[index % colorPalette.length];
  }

  React.useEffect(() => {
    const graphData = data.map((item, index) => {
      return {
        x: item.title,
        y: Number(item.acessos),
        label: `${item.title}: ${Number(item.acessos)}`,
        fill: getColor(index),
      };
    });

    graphData.sort((a, b) => b.y - a.y);

    const totalAcessos = data
      .map(({ acessos }) => Number(acessos))
      .reduce((a, b) => a + b, 0);

    setTotal(totalAcessos);
    setGraph(graphData);
  }, [data]);

  const displayData = graph;

  return (
    <section className={`${styles.statsSection} animeLeft`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📈 Análise Detalhada</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className={`${styles.listCard} ${styles.graphCard}`}>
          <div className={styles.cardHeader}>
            <h3>Ranking por Acessos</h3>

            <span className={styles.cardIcon}>🏆</span>
          </div>

          <div className={styles.performanceList}>
            {displayData.map((item, index) => (
              <div key={index} className={styles.performanceItem}>
                <div className={styles.performanceRank}>
                  <span className={styles.rankNumber}>#{index + 1}</span>
                </div>
                <div className={styles.performanceContent}>
                  <h4 className={styles.performanceTitle}>
                    {item.x.length > 30
                      ? `${item.x.substring(0, 30)}...`
                      : item.x}
                  </h4>
                  <div className={styles.performanceStats}>
                    <span className={styles.performanceViews}>
                      {item.y.toLocaleString()} views
                    </span>
                    <span className={styles.performancePercent}>
                      {((item.y / total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div
                  className={styles.performanceBar}
                  style={{
                    '--width': `${(item.y / displayData[0].y) * 100}%`,
                    '--color': getColor(index),
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.graphsGrid}>
          <div className={`${styles.pieCard} ${styles.graphCard}`}>
            <div className={styles.cardHeader}>
              <h3>Distribuição de Acessos</h3>
              <span className={styles.cardIcon}>🥧</span>
            </div>
            <div className={styles.pieContainer}>
              <VictoryPie
                data={displayData}
                innerRadius={60}
                padAngle={2}
                cornerRadius={4}
                padding={{ top: 20, bottom: 20, left: 80, right: 80 }}
                colorScale={displayData.map((_, index) => getColor(index))}
                labelRadius={({ innerRadius }) => innerRadius + 80}
                labelComponent={
                  <VictoryLabel
                    style={{ fontSize: 12, fill: '#374151', fontWeight: '600' }}
                  />
                }
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 },
                }}
              />
            </div>
            <div className={styles.pieStats}>
              <div className={styles.pieStat}>
                <span className={styles.pieStatLabel}>Mais acessado:</span>
                <span className={styles.pieStatValue}>
                  {displayData[0]?.x.substring(0, 20)}...
                </span>
              </div>
            </div>
          </div>

          <div className={`${styles.barCard} ${styles.graphCard}`}>
            <div className={styles.cardHeader}>
              <h3>Performance dos Posts</h3>
              <span className={styles.cardIcon}>📊</span>
            </div>
            <div className={styles.barContainer}>
              <VictoryChart
                padding={{ left: 80, top: 20, right: 40, bottom: 60 }}
                height={300}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 },
                }}
              >
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => x.toLocaleString()}
                  style={{
                    tickLabels: {
                      fontSize: 11,
                      fill: '#6b7280',
                      fontFamily: 'Inter, sans-serif',
                    },
                    axis: { stroke: '#e5e7eb' },
                    grid: { stroke: '#f3f4f6', strokeDasharray: '3,3' },
                  }}
                />
                <VictoryAxis
                  fixLabelOverlap={true}
                  style={{
                    tickLabels: {
                      fontSize: 10,
                      fill: '#6b7280',
                      fontFamily: 'Inter, sans-serif',
                      angle: -45,
                      textAnchor: 'end',
                    },
                    axis: { stroke: '#e5e7eb' },
                  }}
                />
                <VictoryBar
                  data={displayData}
                  x="x"
                  y="y"
                  style={{
                    data: {
                      fill: ({ index }) => getColor(index),
                      stroke: '#ffffff',
                      strokeWidth: 1,
                      fillOpacity: 0.8,
                    },
                  }}
                  cornerRadius={{ top: 4 }}
                  labelComponent={
                    <VictoryTooltip flyoutStyle={{ fill: '#374151' }} />
                  }
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 },
                  }}
                />
              </VictoryChart>
            </div>
          </div>
        </div>

        <div className={styles.insightsFooter}>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>💡</span>
            <span className={styles.insightText}>
              Seus {Math.ceil(displayData.length * 0.2)} posts mais populares
              representam{' '}
              {(
                (displayData
                  .slice(0, Math.ceil(displayData.length * 0.2))
                  .reduce((acc, item) => acc + item.y, 0) /
                  total) *
                100
              ).toFixed(0)}
              % do total de visualizações
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStatsGraph;
