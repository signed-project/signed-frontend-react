import React from 'react';
import { connect } from 'react-redux';
import { ToggleButtonGroup, Col, Container, Row, ToggleButton, InputGroup, FormControl, Button } from 'react-bootstrap';


const FILTERS = [
  { title: 'Все', value: null },
  { title: 'Текущие', value: false },
  { title: 'Заверешнные', value: true }
]

const Header = ({ title }) => {
  return (
    <Container>
      <Row>
        <Col>LOGO1</Col>
        <Col><h1>{title}</h1></Col>
        <Col>
          <ToggleButtonGroup
            name='activity-filter'
            type='radio'
          >
            {FILTERS.map((f) =>
              <ToggleButton key={f.value} value={f.value}>{f.title}</ToggleButton>
            )}
          </ToggleButtonGroup>
        </Col>
        <Col>
          <InputGroup>
            <FormControl
              placeholder='Поиск' />
            <InputGroup.Append>
              <Button variant='outline-secondary'>O</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col>LOGO2</Col>
      </Row>
    </Container>
  );
};

export default Header;
