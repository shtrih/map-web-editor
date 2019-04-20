import React, { Component } from 'react';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch.js';

import AssetGroups from './components/AssetGroups';
import AssetObjects from './components/AssetObjects';
import Tools from './components/Tools';
import Layers from './components/Layers';

import 'materialize-css/dist/css/materialize.min.css'

import './index.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.onSelectAssetGroup = this.onSelectAssetGroup.bind(this);
        this.onSelectAsset = this.onSelectAsset.bind(this);

        this.state = {
            inMainMenu: true,
            mainMenuState: null,
            activeAssetGroup: null,
            activeAsset: null
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

    onSelectAsset(event, item) {
        this.setState({
            activeAsset: item
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

        return (
            <div id="workscreen" className="row">
                <div id="mapEditor" className="noPadding">
                    <P5Wrapper
                        sketch={sketch}
                        style={{position: 'absolute', 'left': 0, 'top': 0, width: '100%', height: '100%'}}
                        activeAsset={this.state.activeAsset}
                    />
                </div>

                <div className="side-panel">
                    <div id="modelPreview">
                        <h3 className="center-align">3D model preview</h3>
                    </div>
                    <div id="instrumentTabs">
                        <Tools />
                        <Layers />
                    </div>
                    <div id="assetGroups" className="row">
                        <div className="col s6">
                            <h6>Группы обьектов</h6>
                            <AssetGroups clickHandler={this.onSelectAssetGroup} />
                        </div>
                        <div id="assets" className="col s6">
                            <h6>Обьекты</h6>
                            <AssetObjects
                                objectsList={this.state.activeAssetGroup}
                                clickHandler={this.onSelectAsset}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
