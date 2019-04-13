import React from 'react';
import PropTypes from 'prop-types';

export default class AssetObjects extends React.Component {
    constructor(props) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);

        this.state = {
            error: null,
            isLoaded: null,
            items: []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.objectsList !== prevProps.objectsList) {
            this.fetchData(this.props.objectsList);
        }
    }

    fetchData(listName) {
        this.setState({
            isLoaded: false
        });

        fetch(`/js/stubs/${listName}.json`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    clickHandler(event) {
        const children = event.target.parentNode.childNodes;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('active')
        }
        event.target.classList.add('active');

        this.props.clickHandler(event);

        return false;
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (false === isLoaded) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div className="center-align">
                    <h3>Пока пусто...</h3>
                    <p>Выберите что-нибудь из списка объектов правее и начните строить ваше помещение!</p>
                </div>
            );
        } else {
            return (
                <div className="collection noPadding">
                    {items.map(item => (
                        <a key={item.name} href="#!" onClick={this.clickHandler} className="collection-item center-align">{item.name}</a>
                    ))}
                </div>
            );
        }
    }
}

AssetObjects.propTypes = {
    clickHandler: PropTypes.func
};
