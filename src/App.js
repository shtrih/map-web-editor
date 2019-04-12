import React, { Component } from 'react';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch.js';

import AssetGroups from './components/AssetGroups';
import AssetObjects from './components/AssetObjects';

import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css';

import './index.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.onSelectAssetGroup = this.onSelectAssetGroup.bind(this);

        this.state = {
            inMainMenu: true,
            mainMenuState: null,
            activeAssetGroup: null
        };
    }

    startNew() {
        this.setState({
            inMainMenu: false
        });
    }

    onSelectAssetGroup(event) {
        this.setState({
            activeAssetGroup: event.target.dataset.objects
        });
    }

    render() {
        if (this.state.inMainMenu) {
            return (
                <div className="screen" id="startScreen">

                    <div className="container">
                        <h3 className="center z-depth-3" style={{padding: "1.2rem", backgroundColor: "rgba(255, 255, 255, 0.815)"}}>Добро
                            пожаловать в редактор тайлов для SCP Community!</h3>

                        <div className="row">
                            <div className="col s6 offset-s3">
                                <div className="card blue-grey darken-1" id="mainMenuCard">
                                    <div className="card-content white-text">
                                        <span className="card-title center">Настройки</span>
                                        <p className="center">Создайте новый объект или загрузите существующий файл</p>
                                    </div>
                                    <div className="card-action center">
                                        <a href="#!" onClick={() => this.startNew()}>Создать новый</a>
                                        <a href="#!" onClick={() => this.setState({mainMenuState: "loadFile"})}>Загрузить</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            );
        }

        let timer = setInterval(() => {
            if (document.querySelector('#instrumentTabsUl') == null) return;
            M.Tabs.init(document.querySelector('#instrumentTabsUl'));
            clearInterval(timer);
        }, 50);

        return (
            <div id="workscreen" className="row">
                <div id="mapEditor" className="noPadding">
                    <P5Wrapper
                        sketch={sketch}
                        style={{position: 'absolute', 'left': 0, 'top': 0, width: '100%', height: '100%'}}
                    />
                </div>

                <div id="modelPreview">
                    <h3 className="center-align">3D model preview</h3>
                </div>
                <div id="instrumentTabs">
                    <div className="row">
                        <div className="col s12 noPadding">
                            <ul className="tabs" id="instrumentTabsUl">
                                <li className="tab col s4"><a href="#tools">Tools</a></li>
                                <li className="tab col s4"><a href="#layers">Layers</a></li>
                                <li className="tab col s4"><a className="active" href="#assets">Assets</a></li>
                            </ul>
                        </div>
                        <div id="tools" className="col s12"><h3 className="center-align">Tools</h3></div>
                        <div id="layers" className="col s12"><h3 className="center-align">Layers</h3></div>
                        <div id="assets" className="col s12">
                            <AssetObjects
                                objectsList={this.state.activeAssetGroup}
                                clickHandler={() => false}
                            />
                        </div>
                    </div>
                </div>
                <div id="assetGroups">
                    <AssetGroups clickHandler={this.onSelectAssetGroup} />
                </div>
            </div>
        );
    }
}

export default App;
