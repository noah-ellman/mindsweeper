import React from 'react';
import MyButton from "./comp/MyButton";
import MyGrid from "./comp/MyGrid";
import Mindsweeper from "./Mindsweeper";
import './main.css';

/**
 *  @function RenderCell
 *  This is the function that renders the content of every cell in the data grid.
 *  I want to use my generic data grid component,
 *  so I'm passing this function as the cellRenderer property.
 */
function RenderCell(props) {
    let content = '';
    let cssClass = 'msweep-hidden';
    if (props.visible) {
        cssClass = 'msweep-visible';
        if (props.bombsNearby > 0) content = props.bombsNearby;
    }
    if (props.visible && props.bomb) {
        cssClass = 'msweep-bomb';
        content = 'x';
    }
    cssClass = 'msweep-normal ' + cssClass;
    return (
        <div className={cssClass}>{content}</div>
    );
}



class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.newGame();
    }

    newGame(options) {
        this.mindsweeper = new Mindsweeper(options || {width:8,height:8,difficulty:10});
        // setup events
        this.mindsweeper.on('gameover', () => this.setState({gameStatusButton: "You're dead!"})) ;
        this.setState({gameStatusButton: "Validate", turns: 0, data: this.mindsweeper.matrix });
        if( this.mygrid ) this.mygrid.setState({ data: this.mindsweeper.matrix });

    }

    validateWin() {
        let tilesLeft = this.mindsweeper.validateWin();
        if( tilesLeft ) alert("Hint: " + tilesLeft + " safe squares left to find!")
        else alert("You win!");
    }

    handleClick(e, x, y) {
        // User clicked a grid cell, pass the event onto the mindsweeper logic module
        if (!this.mindsweeper.clickTile(x, y)) return false;
        this.mygrid.setState({ data: this.mindsweeper.matrix });
    }

    render() {
        let gameStatusButton = this.state.gameStatusButton || 'Validate';
        return (
            <div className="app">
                <div className="form-inline">
                    <div className="btn-group" style={{marginRight:"25px"}}>
                        <MyButton color="primary" size="lg" text="Easy" onClick={() => this.newGame({width:8,height:8,difficulty:10})}/>
                        <MyButton color="warning" size="lg" text="Medium" onClick={() => this.newGame({width:20,height:15,difficulty:25})}/>
                        <MyButton color="danger" size="lg" text="Hard" onClick={() => this.newGame({width:35,height:20,difficulty:70})}/>
                    </div>
                    <MyButton color="success" size="lg" text={gameStatusButton} onClick={()=>this.validateWin()}/>
                </div>
                <br/>
                <div className="mindsweeper-container">
                    <MyGrid ref={(mygrid) => this.mygrid = mygrid} data={this.state.data}
                            onClick={(e, x, y) => this.handleClick(e, x, y)} cellRenderer={RenderCell}/>
                </div>
            </div>
        );
    }
}

export default App;
