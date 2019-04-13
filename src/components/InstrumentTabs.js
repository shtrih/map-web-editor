import React from 'react';
import AssetObjects from './AssetObjects';
import M from 'materialize-css';
import PropTypes from 'prop-types';

export default class InstrumentTabs extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        M.Tabs.init(document.querySelector('#instrumentTabsUl'));
    }

    render() {
        return (
            <React.Fragment>
                <ul className="tabs" id="instrumentTabsUl">
                    <li className="tab col s4"><a href="#tools">Tools</a></li>
                    <li className="tab col s4"><a href="#layers">Layers</a></li>
                    <li className="tab col s4"><a className="active" href="#assets">Assets</a></li>
                </ul>
                <div id="tools" className="col s12"><h3 className="center-align">Tools</h3></div>
                    <div id="layers" className="col s12"><h3 className="center-align">Layers</h3></div>
                    <div id="assets" className="col s12">
                    <AssetObjects
                        objectsList={this.props.activeAssetGroup}
                        clickHandler={this.props.onSelectAsset}
                    />
                </div>
            </React.Fragment>
        );
    }
}

InstrumentTabs.propTypes = {
    activeAssetGroup: PropTypes.string,
    onSelectAsset: PropTypes.func
};
