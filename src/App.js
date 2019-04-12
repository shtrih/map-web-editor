import React, { Component } from 'react';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch.js';

import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css';

import './index.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inMainMenu: true,
            mainMenuState: null,
            width:  30,
            height: 30
        };
        this.mainMenuF = {
            createNew: () => {
                console.log("Hello");
            },
            loadFile: () => {
                console.log("Loading file");
            },
            state: null
        }
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
                                        <this.MenuContent state={this.state.mainMenuState} elt={this}/>
                                    </div>
                                    <div className="card-action center">
                                        <a href="#!" onClick={() => this.setState({mainMenuState: "createNew"})}>Создать новый</a>
                                        <a href="#!" onClick={() => this.setState({mainMenuState: "loadFile"})}>Загрузить</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            );
        }
        else {
            let timer = setInterval(() => {
                if (document.querySelector('#instrumentTabsUl') == null) return;
                M.Tabs.init(document.querySelector('#instrumentTabsUl'));
                clearInterval(timer);
            }, 50);
            return(
                <div id="workscreen" className="row">
                    <div id="mapEditor" className="noPadding">
                        <P5Wrapper sketch={sketch}
                                // width={this.state.width}
                                // height={this.state.height}
                                style={{position: 'absolute', 'left': 0, 'top': 0, width: '100%', height: '100%'}}
                        />
                    </div>

                    <div id="modelPreview">
                        <h3 className="center-align">3D model preview</h3>
                    </div>
                    <div id="instrumentTabs">
                        {/* <h3 className="center-align">Instruments</h3> */}
                        <script>
                            console.log("PLEASE");
                        </script>
                        <div className="row">
                            <div className="col s12 noPadding">
                                <ul className="tabs" id="instrumentTabsUl">
                                    <li className="tab col s4"><a className="active" href="#tools">Tools</a></li>
                                    <li className="tab col s4"><a href="#layers">Layers</a></li>
                                    <li className="tab col s4"><a href="#assets">Assets</a></li>
                                </ul>
                            </div>
                            <div id="tools" className="col s12"><h3 className="center-align">Tools</h3></div>
                            <div id="layers" className="col s12"><h3 className="center-align">Layers</h3></div>
                            <div id="assets" className="col s12"><h3 className="center-align">Assets</h3></div>
                        </div>
                    </div>
                    <div id="assetGroups">
                        <h3 className="center-align">Asset Groups</h3>
                    </div>
        
                </div>
            );
        }
    }
    MenuContent(props) {
        if (props.state == null)
            return <p className="center">Создайте новый объект или загрузите существующий файл</p>
        else if (props.state === "createNew")
            return (
                <div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="widthInp" type="number" className="validate" />
                            <label htmlFor="widthInp">Ширина карты</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <input id="heightInp" type="number" className="validate" />
                            <label for="heightInp">Высота карты</label>
                        </div>
                    </div>
                    <p className="center">Это создаст карту в виде прямоугольника X*Y (оставьте пустым для 1x1); Заметьте, что каждую отдельную строчку и столбец можно будет вытягивать и сжимать по требованию</p>
                    <div className="row">
                        <a href="#!" className="center-align waves-effect waves-light btn" onClick={() => props.elt.startNew(props.elt)}>Создать</a>
                    </div>
                </div>
            );

        return <b className="center">"Непрописанное состояние меню"</b>;
    }
    startNew(elt) {
        let width = ~~document.getElementById('widthInp').value || 1,
            height = ~~document.getElementById('heightInp').value || 1;

        if (width < 1) width = 1;
        if (height < 1) height = 1;

        elt.setState({
            width,
            height,
            inMainMenu: false
        });
    }
}

export default App;
