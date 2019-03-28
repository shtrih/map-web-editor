import React, {Component} from 'react'


class Tile extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {tile} = this.props
        return(
            <h3>{tile.tileName}</h3>
        )
    }
}
export default Tile