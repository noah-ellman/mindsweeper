/** @type React */
import React from 'react';
import MyGridCell from "./MyGridCell";

/**
 *   @class MyGrid
 *   @extends React.Component
 *
 *   Nice component for rendering a grid of whatever you want.
 *   Pass the data property that contains a mastrix.
 *
 *   You must include also pass a function to that renders the content of each grid cell.
 *
 **/

const css = {
    container: {
        display: "inline-block",
        width: "auto",
        height: "auto",
        margin: "20px 0px 0px 5px"
    },
    cell: {
        cssFloat: "left",
        display: "table-cell",
        verticalAlign: "middle",
        textAlign: "center",
        height:"2vmax",
        width:"75hmax",
        minWidth:"25px",
        minHeight:"23px",
        maxHeight: "30px",
        maxWidth: "40px"
    }
};

class MyGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: this.props.data };
    }


    handleClick(e, x, y) {
        return this.props.onClick(e,x,y);
    }


    render() {
        let cols = this.state.data[0].length;
        let rows = this.state.data.length;
        const matrix = new Array(rows).fill(null).map(() => new Array(cols).fill(null));
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let content = this.props.cellRenderer(this.state.data[y][x]);
                matrix[y][x] = <MyGridCell style={css.cell}
                                           className="mygrid-cell"
                                           data={this.props.data[y][x]}
                                           onClick={(e) => this.handleClick(e, x, y)}
                                           content={content}/>
            }
            matrix[y].push(<br className="clearfix" style={{clear:"both"}}/>);

        }
        return (
            <div style={css.container} className="mygrid-container">
                {matrix}
            </div>
        );
    }

};

MyGrid.defaultProps = {
    data: [[]],
    onClick:()=>false,
    cellRenderer:()=>'x'

};

MyGrid.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.array),
    onClick:React.PropTypes.func,
    cellRenderer: React.PropTypes.func.isRequired
};

export default MyGrid;