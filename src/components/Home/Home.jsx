import React from 'react';
import styles from './Home.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BottomNav } from '../BottomNav/BottomNav';

const dailyTarget = {
  calories: 2500,
  carbs: 400,
  protein: 300,
  fat: 100,
  activity: 2.5
};

const actualIntake = {
  caloriesTaken: 1800,
  caloriesBurnt: 500,
  carbs: 320,
  protein: 280,
  fat: 110,
  activityDuration: 1.75
};

const COLORS = ['#2e7d32'];

const renderPie = (name, actual, target, unit = 'g') => {
  const value = Math.min(actual, target);
  const data = [
    { name: 'Achieved', value },
    { name: 'Remaining', value: target - value }
  ];

  return (
    <div className={styles.pieBox}>
      <div className={styles.chartTitle}>{name}</div>
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            startAngle={90}
            endAngle={450}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={COLORS[0]} />
            <Cell fill="#e0e0e0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.gramOverlay}>
        {actual} {unit}<br />
        / {target} {unit}
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <div className={styles.container}>
      <h2>Hello, User</h2>

      <div className={styles.calorieBar}>
        <div className={styles.calorieBoxGreen}>
          <div className={styles.label}>Taken</div>
          <div>{actualIntake.caloriesTaken} Kcal</div>
        </div>
        <div className={styles.calorieBoxCenter}>
          {dailyTarget.calories}
        </div>
        <div className={styles.calorieBoxBrown}>
          <div className={styles.label}>Burnt</div>
          <div>{actualIntake.caloriesBurnt} Kcal</div>
        </div>
      </div>

      <h3>Measurement</h3>

      <div className={styles.chartGrid}>
        {renderPie('Carbohydrate', actualIntake.carbs, dailyTarget.carbs)}
        {renderPie('Protein', actualIntake.protein, dailyTarget.protein)}
        {renderPie('Fat', actualIntake.fat, dailyTarget.fat)}
        {renderPie('Activity', actualIntake.activityDuration, dailyTarget.activity, 'hrs')}
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
