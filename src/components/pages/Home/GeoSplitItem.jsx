import React from 'react';
import { Col, Row } from 'react-bootstrap';

import styles from './home.module.scss';

const Progress = ({ value }) => {
  return (
    <span className={styles['progress']}>
      {Math.floor(value)}%
    </span>
  )
}

const Research = ({ progress, icon }) => {
  return (
    <span className={styles['research']}>
      ({icon})
      {progress?.map((v) =>
        <span
          key={v}
          className={styles['researchTick']}
          style={{ backgroundColor: ['#c0cad2', '#24c967', '#feaf04', '#f24841'][v] }}
        ></span>
      )}
      {progress?.filter(v => [1, 2].includes(v)).length}/{progress?.length}
    </span>
  )
}

const GeoSplitItem = ({ item }) => {
  const RES_TYPES = ['well', 'sample', 'lab'];
  const RES_MX = [20, 30, 40];
  const progresses = RES_TYPES.map(resType =>
    (new Array(8 + Math.floor(Math.random() * 7)).fill(0)).map((v, i, a) => Math.floor(Math.random() * 4))
  );
  const finalReport = Math.random() > 0.5;
  const totalProgress = progresses.map((a, i) => a.filter(v => [1, 2].includes(v)).length / a.length * RES_MX[i]).reduce((p, c) => p + c) + finalReport * 10; //refactor
  return (
    <li className={styles['geoSplitItem']}>
      <Row>
        <Col>{finalReport && 'F'}<big>{item.name}</big></Col>
        <Col>{item.geoSplitGroup.name}</Col>
        <Col>{item.solutionType.name}</Col>
        {RES_TYPES.map((icon, i) =>
          <Col key={icon}><Research icon={icon} progress={progresses[i]} /></Col>
        )}
        <Col><Progress value={totalProgress} /></Col>
      </Row>
    </li>
  )
}

export default GeoSplitItem;
