import React, { Component } from 'react';

import P5Wrapper from 'react-p5-wrapper';
import sketchMain from './sketches/sketch';
import sketchFPSCounter from './sketches/sketchFPSCounter';

import AssetGroups from './components/AssetGroups';
import AssetObjects from './components/AssetObjects';
import Tools from './components/Tools';
import Layers from './components/Layers';

import {
    HotKeys,
    GlobalHotKeys,
    configure as hotKeyConfigure,
} from 'react-hotkeys';

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
                        <div className="row">
                            <div className="col s12">
                                <h1 className="header center z-depth-3">Добро пожаловать в редактор тайлов для SCP Community!</h1>
                            </div>
                            <div className="col s6 offset-s3">
                                <div className="card blue-grey darken-1">
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
            <div id="workscreen">
                <div id="mapEditor">
                    <P5Wrapper
                        sketch={sketchMain}
                        activeAsset={this.state.activeAsset}
                    />
                </div>

                <div id="sidePanel">
                    <div className="model-preview">
                        <h3 className="center-align">3D model preview</h3>
                        <P5Wrapper
                            sketch={sketchFPSCounter}
                            width="100"
                            height="50"
                        />
                    </div>
                    <div className="instruments">
                        <Tools />
                        <Layers />
                    </div>
                    <div className="asset-lists row">
                        <div className="col s6">
                            <h6>Группы обьектов</h6>
                            <AssetGroups clickHandler={this.onSelectAssetGroup} />
                        </div>
                        <div className="col s6">
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
