import React, {Component} from 'react'
import Tile from './Tile'

class Section extends Component{
    constructor(props){
        super(props)
        this.state = {
            isOpen:false
        }
    }
    render(){
        const {section} = this.props
        const tiles = section.map(tile =>
            <li key = {tile.id} className='article-list-li'>
                <h1>{tile.sectionName}</h1>
                <Tile tile = {tile}/>
            </li>)
        return(
            <ul>
                {tiles}
            </ul>
        )
    }
}

export default Section