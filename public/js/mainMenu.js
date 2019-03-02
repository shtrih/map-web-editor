'use strict';

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createSelected: false,
            loadSelected: false
        };
    }

    createCard(status, content) {
        return `
            <div class="card-content white-text">
                <span class="card-title center">Настройки</span>
                <p class="center">${status}</p>
                <div>${content}</div>
            </div>
            <div class="card-action center">
                <a href="#">Создать новый</a>
                <a href="#">Загрузить</a>
            </div>
        `;
    }

    render() {
        if (this.state.createSelected) {
            
        }
        else if (this.state.loadSelected) {

        }
        else {
            return this.createCard('Ожидание ввода.', '');
        }
    }
}

const domContainer = document.querySelector('#mainMenuCard');
ReactDOM.render(React.createElement(MainMenu), domContainer);