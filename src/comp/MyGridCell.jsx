/** @type React */
import React from 'react';

/**
 *   @class MyGridCell
 *   @extends React.Component
 *
 *   A component that represets each cell in a the grid of a MyGrid component.
 *   I'm trying to keep this component generic.  Put all custom rendering code in a
 *   cellRenderer function that's passed to MyGrid.
 *
 **/

class MyGridCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        Object.assign(this.state,this.props.data);

    }


    render() {
        this.style = {};
        Object.assign(this.style, this.props.style);
        return (
            <div
                className={this.props.className}
                style={this.style}
                data={this.state}
                onClick={this.props.onClick}>
                {this.props.content}
            </div>
        );
    }

};

MyGridCell.defaultProps = {
    onClick: ()=>false,
    content: '',
    data: {},
    className: ''
};

MyGridCell.propTypes = {
    onClick: React.PropTypes.func.isRequired
};

export default MyGridCell;