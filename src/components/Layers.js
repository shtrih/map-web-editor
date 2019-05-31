import React from 'react';

import './Layers.css';

export default class InstrumentTabs extends React.Component {
    constructor(props) {
        super(props);

        this.layers = [
            {title: 'Пол'},
            {title: 'Стены'},
            {title: 'Двери'},
            {title: 'Обьекты'},
            {title: 'Скрипты'},
            {title: 'Потолок'},
        ];

        this.state = {
            active: 0,
            visible: {}
        };

        for (let idx in this.layers) {
            this.state.visible[idx] = true;
        }
    }

    handleLayerClick(idx) {
        this.setState({active: idx});

        return false;
    }

    handleEyeClick(idx) {
        this.setState({
            visible: {
                ...this.state.visible,
                [idx]: !this.state.visible[idx]
            }
        });

        return false;
    }

    render() {
        return (
            <div className="layers">
                <h6>Слои</h6>
                <ul className="collection">
                    {this.layers.map((layer, idx) => {
                        return (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className={(this.state.visible[idx] ? 'active ' : '') + 'eye'}
                                    onClick={this.handleEyeClick.bind(this, idx)}
                                    title="Показать/скрыть слой"
                                >
                                    <i className="material-icons">remove_red_eye</i>
                                </a>
                                <a
                                    href="#" className={(this.state.active === idx ? 'active ' : '') + 'collection-item'}
                                    onClick={this.handleLayerClick.bind(this, idx)}
                                >
                                    {layer.title}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}
