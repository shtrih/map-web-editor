import React, { Component } from 'react';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch.js';

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
                <div class="screen" id="startScreen">

                    <div class="container">
                        <h3 className="center z-depth-3" style={{padding: "1.2rem", backgroundColor: "rgba(255, 255, 255, 0.815)"}}>Добро
                            пожаловать в редактор тайлов для SCP Community!</h3>

                        <div class="row">
                            <div class="col s6 offset-s3">
                                <div class="card blue-grey darken-1" id="mainMenuCard">
                                    <div class="card-content white-text">
                                        <span className="card-title center">Настройки</span>
                                        <this.MenuContent state={this.state.mainMenuState} elt={this}/>
                                    </div>
                                    <div class="card-action center">
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
            return(
                <div id="workScreen">
                  <P5Wrapper sketch={sketch}
                             width={this.state.width}
                             height={this.state.height}
                  />
                </div>
            );
        }
    }
    MenuContent(props) {
        if (props.state == null)
            return <p class="center">Создайте новый объект или загрузите существующий файл</p>
        else if (props.state === "createNew")
            return (
                <div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="widthInp" type="number" class="validate" />
                            <label for="widthInp">Ширина карты</label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-field col s12">
                            <input id="heightInp" type="number" class="validate" />
                            <label for="heightInp">Высота карты</label>
                        </div>
                    </div>
                    <p class="center">Это создаст карту в виде прямоугольника X*Y (оставьте пустым для 1x1); Заметьте, что каждую отдельную строчку и столбец можно будет вытягивать и сжимать по требованию</p>
                    <div class="row">
                        <a href="#!" class="center-align waves-effect waves-light btn" onClick={() => props.elt.startNew(props.elt)}>Создать</a>
                    </div>
                </div>
            );

        return <b class="center">"Непрописанное состояние меню"</b>;
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
