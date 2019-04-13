import React from 'react';
import PropTypes from 'prop-types';

export default class AssetGroups extends React.Component {
    constructor(props) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);

        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch("/js/stubs/assets-groups.json")
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
        } else if (!isLoaded) {
            return (
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            );
        } else {
            return (
                <div className="collection noPadding noMargin">
                    {items.map(item => (
                        <a key={item.name} href="#!" onClick={this.clickHandler} className="collection-item center-align" data-objects={item.objects}>{item.name}</a>
                    ))}
                </div>
            );
        }
    }
}

AssetGroups.propTypes = {
    clickHandler: PropTypes.func
};
