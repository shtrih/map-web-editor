import React from 'react';

import './Tools.css';

export default class InstrumentTabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="tools">
                <h6>Инструменты</h6>
                <a className="create" title="Создать"><i className="material-icons">create</i></a>
                <a className="load" title="Загрузить"><i className="material-icons">file_upload</i></a>
                <a className="save" title="Сохранить"><i className="material-icons">file_download</i></a>
                <a className="zoom-in" title="Увеличить масштаб"><i className="material-icons">zoom_in</i></a>
                <a className="zoom-out" title="Уменьшить масштаб"><i className="material-icons">zoom_out</i></a>
                <a className="clear-layer" title="Очистить слой"><i className="material-icons">delete_sweep</i></a>
                <a className="help" title="Справка по горячим клавишам"><i className="material-icons">help_outline</i></a>
            </div>
        );
    }
}
