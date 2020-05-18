import React from 'react'
import {Card} from 'react-bootstrap'
import Truncate from 'react-truncate';
import { MdShare,MdDelete} from "react-icons/md";
import {EmailShareButton, FacebookShareButton,TwitterShareButton} from "react-share";
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import {Link, Redirect} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


class Search_card extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:false,
            carr:false,
            card:false
        }
        this.handleShow=this.handleShow.bind(this)
        this.handleClose=this.handleClose.bind(this)
        this.mods=this.mods.bind(this)
    }

    handleShow(event){
        event.stopPropagation();
         this.setState({
             show:true
         });
    }

    handleClose(){
        this.setState({
            show:false
        });
    }

    mods(){
        this.setState({
            card:true
        })
    }

    render(){
            var carry=""
            if(this.props.st.name==='GUARDIAN')
                carry="guardian"
            else
                carry="newyorkk"
            const sec=this.props.st.sectionId;
            const color1=
            {
                backgroundColor : "",
                color : ""
            };
            
            if(sec==='world'){ color1.backgroundColor='#7c4eff'; color1.color='white'}
            else if(sec==='politics') {color1.backgroundColor='#419488'; color1.color='white'}
            else if(sec==='business') {color1.backgroundColor='#4696ec'; color1.color='white'}
            else if(sec==='technology') {color1.backgroundColor='#cedc39'; color1.color='black'}
            else if(sec==='sport') {color1.backgroundColor='#f6c244'; color1.color='black'}
            else  {color1.backgroundColor='#6e757c'; color1.color='white'}
            // if(name==='GUARDIAN') {color2.backgroundColor='#142849'; color2.color='white'}
            // else if(name==='NYTIMES') {color2.backgroundColor='#dddddd'; color2.color='black'}

            if(this.state.card===true){
                return(<Redirect push to={"/article/"+carry + this.props.st.id} />)
            }
                
            else{
                var cc=""
                if(this.props.st.sectionId){
                    cc=this.props.st.sectionId.toUpperCase()
                }
                return(
                   
                    <div className="col-md-3">
                        <div onClick={this.mods}>
                        <Card className="my-2 shadow-lg">
                            <Card.Body>
                            <Card.Title style={{fontSize:16}}>
                                <Truncate lines={2} ellipsis={ <span >... </span> }>
                                <i>{this.props.st.webTitle}</i>
                                </Truncate>
                                <MdShare onClick={this.handleShow}/>
                                

                            </Card.Title>
                            <Card.Img className="img-thumbnail" variant="top" src={this.props.st.Image} />
                            <Card.Text>
                                <div style={{fontSize:14}}>
                                <br />
                                <i>{this.props.st.Date.split('T')[0]}</i>
                                <Badge variant="primary" style={color1} className=" m-1 float-right">{cc}  </Badge>
                                </div>
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </div>

                        <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>{this.props.st.webTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <div style={{textAlign:"center",fontSize:"1.3rem", fontWeight:"500"}} className="mb-1 mt-0"> Share Via</div>
                            <div style={{display:"flex"}}>
                            <FacebookShareButton className='col-md-4' url={this.props.st.URL} hashtag='#CSCI_571_NewsApp'><FacebookIcon round={true} /></FacebookShareButton>
                            <TwitterShareButton className='col-md-4' url={this.props.st.URL} title={this.props.st.webTitle} hashtags={['CSCI_571_NewsApp']} ><TwitterIcon round={true} /></TwitterShareButton>
                            <EmailShareButton className='col-md-4' subject={'#CSCI_571_NewsApp'} body={this.props.st.webTitle}><EmailIcon round={true} /></EmailShareButton>
                        </div></Modal.Body>
                        </Modal>
                    </div>
            
                )
            }
        
    }
}

export default Search_card
