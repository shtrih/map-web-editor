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

                {this.props.children}
            </div>
        );
    }
}
