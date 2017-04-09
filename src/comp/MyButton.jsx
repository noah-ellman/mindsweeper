import React from 'react';

/**
 *   @class MyButton
 *   @extends React.Component
 *   @author Noah Ellman
 *
 *   A nice button component that creates a Bootstrap button.
 *   Easily add the icon / size / color / and onClick prop to spiffy it up.
 *
 **/

class MyButton extends React.Component {

    constructor(props) {
        super(props);
        this.classNames = ['btn'];
        this.classNames.push('btn-' + this.props.color);
        this.classNames.push('btn-' + this.props.size);
    }

    render() {
        return (
            <button type={this.props.type} className={this.classNames.join(' ')}
                    onClick={this.props.onClick}>
                {this.props.icon ? <span className={"glyphicon glyphicon-" + this.props.icon}/> : ''}
                {this.props.icon ? <span>&nbsp;</span> : ''}
                {this.props.text}
            </button>
        );
    }
}

MyButton.defaultProps = {
    type: "button",
    color: "default",
    size: 'lg',
    text: "MyButton",
    icon: false,
    onClick: () => false
};

MyButton.propTypes = {
    color: React.PropTypes.oneOf(['success', 'primary', 'danger', 'warning', 'default']),
    size: React.PropTypes.oneOf(['lg', 'md', 'sm']),
    text: React.PropTypes.string,
    icon: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
    onClick: React.PropTypes.func
};

export default MyButton;