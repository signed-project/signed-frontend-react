import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from "query-string";
import icon from '../../../assets/svg/icon';
import styles from './source.module.scss';
import { useLocation, useParams, useHistory } from "react-router-dom";
import routes from '../../../config/routes.config';

// TODO: refactor this component to use module Post if it possible
const Source = ({ toggleTheme }) => {
    const user = useSelector(state => state.user);
    const postMapState = useSelector(state => state.post.hashed);
    const location = useLocation();
    const { slider } = queryString.parse(location.search);

    let { hash } = useParams();
    const history = useHistory();


    const [source, setSource] = useState('');

    useEffect(() => {
        toggleTheme(false);
    }, [toggleTheme]);


    return (
        <>
            <div div className={styles.backBlock} >
                <img src={icon.arrowBack} onClick={() => history.push(routes.feed)} alt="arrow back icon" />
            </div>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
            <p>Source</p>
        </>
    );
};

export default Source;
