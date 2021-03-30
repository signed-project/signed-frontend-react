import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { fetchGeoSplits } from '../../../api/services/ResearchService';

import routeConfig from '../../../config/routes.config';
import GeoSplitItem from './GeoSplitItem';

export const config = { path: routeConfig.home.path };

const Home = (props) => {
  const [geoSplits, setGeoSplits] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchGeoSplits(0, 10);
      setGeoSplits(res.geoSplits);
    })();
  }, []);

  return (
    <Row>
      <Col>
        <ul>
          {geoSplits.map((v, i) => (
            <GeoSplitItem key={i} item={v} />
          ))}
        </ul>
      </Col>
    </Row>
  );
};

export default Home;
