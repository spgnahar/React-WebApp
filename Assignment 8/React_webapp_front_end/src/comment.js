import React from 'react'
import commentBox from 'commentbox.io';
import './index.css';

class Comment extends React.Component{
    // constructor(props){
    //     super()
    // }

    componentDidMount(){
        this.removeCommentBox = commentBox('name');
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }

    render(){
        return(
            <div className="commentbox" id={this.props.id}> </div>
        )
    }


} 

export default Comment