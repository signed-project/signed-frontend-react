
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Nav, Row, Tooltip, OverlayTrigger, Image } from 'react-bootstrap';
import classnames from 'classnames';

import styles from './team.module.scss';

const MOCK = [
  {
    photo: "https://cdn.trend.az/2016/07/21/pokemon_210716_01.jpg",
    name: "Евгений Малявко",
    position: "Директор по развитию бизнеса",
    phone: "+7 917 534-95-20",
    email: "evgeniy.maliavko@geosplit.ru",
  },
  {
    photo: "https://www.film.ru/sites/default/files/images/10(186).jpg",
    name: "Антон Буянов",
    position: "Директор по развитию бизнеса",
    phone: "+7 917 534-95-21",
    email: "anton.buianov@geosplit.ru",
  },
  {
    photo: "",
    name: "Ксения Сапрыкина",
    position: "Руководитель технической групыы",
    phone: "7123 4567890",
    email: "kseniia.saprikina@geosplit.ru",
  },
  {
    photo: "",
    name: "Андрей Коростелев",
    position: "Реководитель операционной группы",
    phone: "7 111 123-34-22",
    email: "andrei.korostelev@geosplit.ru",
  },
  {
    photo: "",
    name: "Андрей Новаков",
    position: "Супервайзер",
    phone: "71112223344",
    email: "andrei.novakov@geosplit.ru",
  },
]

const DEFAULT_PHOTO = "https://www.film.ru/sites/default/files/images/10(186).jpg";

const TeamMember = ({ member }) => {
  return (
    <Row className={styles['row']}>
      <Col md="auto" className={styles['photo-wrap']}>
        <Image 
          className={styles['photo']} 
          src={member.photo ? member.photo : DEFAULT_PHOTO}
          roundedCircle
        />  
      </Col>
      <Col>
        <OverlayTrigger
          key = {member.name}
          placement = {'bottom'}
          overlay = {
            <Tooltip 
              id = {member.name}
              bsPrefix = {styles['tooltip']}
            >
              <p className={styles['phone']}>{member.phone}</p>
              <p className={styles['email']}>{member.email}</p>
            </Tooltip>
          }
        >
          <Row>
            <span className={styles['name']}>{member.name}</span>
          </Row>
        </OverlayTrigger>
        <Row className={styles['position']}>
          {member.position}
        </Row>
      </Col>
    </Row>
  );
};

const Team = ({ members = MOCK }) => {
  return (
    <div className={styles['wrapper']}>
      <span className={styles['team']}>Команда</span>
      {members?.map((m, i) =>
        <TeamMember key={i} member={m} />)}
    </div>
  );
};

export default Team;
