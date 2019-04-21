import React from 'react';

import './Layers.css';

export default class InstrumentTabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="layers">
                <h6>Слои</h6>
                <div className="collection">
                    <a href="#!" className="collection-item"><i className="material-icons left">remove_red_eye</i>Пол</a>
                    <a href="#!" className="collection-item active"><i className="material-icons left">remove_red_eye</i>Стены</a>
                    <a href="#!" className="collection-item"><i className="material-icons left">remove_red_eye</i>Двери</a>
                    <a href="#!" className="collection-item"><i className="material-icons left">remove_red_eye</i>Обьекты</a>
                    <a href="#!" className="collection-item"><i className="material-icons left">remove_red_eye</i>Скрипты</a>
                    <a href="#!" className="collection-item"><i className="material-icons left">remove_red_eye</i>Потолок</a>
                </div>
            </div>
        );
    }
}
