import React, { Component } from 'react';

import P5Wrapper from 'react-p5-wrapper';
import sketchMain from './sketches/sketch';
import sketchFPSCounter from './sketches/sketchFPSCounter';

import AssetGroups from './components/AssetGroups';
import AssetObjects from './components/AssetObjects';
import Tools from './components/Tools';
import Layers from './components/Layers';
import HelpDialog from './components/HelpDialog';

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

        hotKeyConfigure({
            logLevel: 'info',

            /**
             * В версии 2.0.0-pre5 не работает обработка keyup для клавиш ctrl и других, если эта опция устанвлена в true.
             * @see https://github.com/greena13/react-hotkeys/issues/166#issuecomment-488991845
             */
            simulateMissingKeyPressEvents: false,
            stopEventPropagationAfterHandling: false,
        });
        this.hotKeys = {
            application: {
                help: ['?', ','],
            },
            editor: {
                save: ['ctrl+s', 'ctrl+ы'],
                zoomIn: [
                    {sequence: 'up', action: 'keydown'},
                    {sequence: 'up', action: 'keyup'},
                ],
                zoomOut: [
                    {sequence: 'down', action: 'keydown'},
                    {sequence: 'down', action: 'keyup'},
                ],
                ctrlPressed: [
                    {sequence: 'ctrl', action: 'keydown'},
                    {sequence: 'ctrl', action: 'keyup'},
                ],
                spacePressed: [
                    {sequence: 'space', action: 'keydown'},
                    {sequence: 'space', action: 'keyup'},
                ],
                shiftPressed: [
                    {sequence: 'shift', action: 'keydown'},
                    {sequence: 'shift', action: 'keyup'},
                ],
            },
        };
        this.hotKeyHandlers = {
            application: {
                help: (e) => {
                    this.setState({
                        showHelpDialog: true
                    });
                },
            },
            editor: {
                save: e => {
                    e.stopPropagation();
                    e.preventDefault();

                    console.log('Saved map!');
                },
                zoomIn: (e) => {
                    this.setState({
                        hotKeyActions: {sketchMain: {zoomIn: e.type !== 'keyup'}}
                    });
                },
                zoomOut: (e) => {
                    this.setState({
                        hotKeyActions: {sketchMain: {zoomOut: e.type !== 'keyup'}}
                    });
                },
                ctrlPressed: (e) => {
                    /**
                     * @see https://github.com/ccampbell/mousetrap/issues/128#issuecomment-102558797
                     */
                    if (e.repeat) {
                        return;
                    }

                    this.setState({
                        hotKeyActions: {sketchMain: {ctrlPressed: e.type !== 'keyup'}}
                    });
                },
                spacePressed: (e) => {
                    if (e.repeat) {
                        return;
                    }

                    this.setState({
                        hotKeyActions: {sketchMain: {spacePressed: e.type !== 'keyup'}}
                    });
                },
                shiftPressed: (e) => {
                    if (e.repeat) {
                        return;
                    }

                    this.setState({
                        hotKeyActions: {sketchMain: {shiftPressed: e.type !== 'keyup'}}
                    });
                },
            },
        };

        this.onSelectAssetGroup = this.onSelectAssetGroup.bind(this);
        this.onSelectAsset = this.onSelectAsset.bind(this);

        this.state = {
            inMainMenu: true,
            mainMenuState: null,
            activeAssetGroup: null,
            activeAsset: null,
            hotKeyActions: {
                sketchMain: {
                    zoomIn: false,
                    zoomOut: false
                }
            },
            showHelpDialog: false,
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
            <React.Fragment>
                <GlobalHotKeys
                    keyMap={this.hotKeys.application}
                    handlers={this.hotKeyHandlers.application}
                />
                <HotKeys
                    keyMap={this.hotKeys.editor}
                    handlers={this.hotKeyHandlers.editor}
                >
                    <div id="workscreen">
                        <div id="mapEditor">
                            <P5Wrapper
                                sketch={sketchMain}
                                activeAsset={this.state.activeAsset}
                                hotKeyActions={{...this.state.hotKeyActions.sketchMain}}
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

                        {this.state.showHelpDialog && <HelpDialog onClose={() => this.setState({showHelpDialog: false})} />}
                    </div>
                </HotKeys>
            </React.Fragment>
        );
    }
}

export default App;
