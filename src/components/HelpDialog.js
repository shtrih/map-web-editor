import React from 'react';
import PropTypes from 'prop-types';

import { getApplicationKeyMap } from 'react-hotkeys';
import M from 'materialize-css';

const propTypes = {
    onClose: PropTypes.func,
};

const defaultProps = {
    onClose: null,
};

export default class HelpDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const element = document.getElementsByClassName('help-dialog')[0];
        this.dialogInstance = M.Modal.init(element, {
            onCloseEnd: this.props.onClose
        });
        this.dialogInstance.open();
    }

    componentWillUnmount() {
        this.dialogInstance.destroy();
    }

    render() {
        const keyMap = getApplicationKeyMap();

        return (
            <div className="modal help-dialog">
                <div className="modal-content">
                    <h1>
                        Keyboard shortcuts
                    </h1>

                    <table>
                        <tbody>
                        {Object.keys(keyMap).map((actionName) => (
                            <tr key={actionName}>
                                <td>
                                    {actionName}
                                </td>
                                <td>
                                    {keyMap[actionName]
                                        .filter((v,i,a) => a.indexOf(v) === i)
                                        .map((keySequence) => <code key={keySequence}>{keySequence}</code>)
                                    }
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

HelpDialog.propTypes = propTypes;
HelpDialog.defaultProps = defaultProps;
