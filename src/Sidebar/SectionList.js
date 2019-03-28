import React, {Component} from 'react'
import Section from "./Section";



class SectionList extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {sections} = this.props
        const sectionElements = sections.map(section =>
            <li key = {section.id} className='article-list-li'>
                <Section section = {section}/>
            </li>)
        return(
            <ul>
                {sectionElements}
            </ul>
        )
    }
}

export default SectionList