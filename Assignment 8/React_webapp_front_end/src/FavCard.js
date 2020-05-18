import React from 'react'
import {Card,CardColumns, Container} from 'react-bootstrap'
import Truncate from 'react-truncate';
import { MdShare,MdDelete} from "react-icons/md";
import {EmailShareButton, FacebookShareButton,TwitterShareButton} from "react-share";
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import {Link,Redirect} from 'react-router-dom';
import {  Nav } from 'react-bootstrap';
import {toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Favourite_card extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:false,
            carr:false,
            card:false
        }
        this.sharing= this.sharing.bind(this)
        this.mods=this.mods.bind(this)
        this.handleShow=this.handleShow.bind(this)
        this.handleClose=this.handleClose.bind(this)
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

    sharing(event){
        event.stopPropagation()
        toast.configure()
        toast("Removing " + this.props.st.webTitle,{
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar:true,
            bodyClassName:"toast-body",
            autoClose: 1500,
            opacity:1,
            transition:Zoom
            
          });
        localStorage.removeItem(this.props.st.URL)
        this.props.del(true)
        this.setState({
            carr:true
        })
        

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
        if(this.state.card===true)
            return(<Redirect push to={"/article/"+carry + this.props.st.id} />)

        else{



            if(this.state.carr===false){
                const sec=this.props.st.sectionId.toLowerCase();
                const name=this.props.st.name
                const color1=
                {
                    backgroundColor : "",
                    color : ""
                };
                const color2=
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
                if(name==='GUARDIAN') {color2.backgroundColor='#142849'; color2.color='white'}
                else if(name==='NYTIMES') {color2.backgroundColor='#dddddd'; color2.color='black'}
    
                return(
                        <div className="col-md-3">
                        <div  onClick={this.mods}>
                            <Card className="my-2 shadow-lg">
                                <Card.Body>
                                <Card.Title style={{fontSize:16}}>
                                    <Truncate lines={2} ellipsis={ <span >... </span> }>
                                    {/* {this.props.shrey.Description} */}
                                    <i>{this.props.st.webTitle}</i>
                                    </Truncate>
                                    <MdShare onClick={this.handleShow}/><MdDelete onClick={this.sharing}/>
                                    
    
                                </Card.Title>
                                <Card.Img className="img-thumbnail" variant="top" src={this.props.st.Image} />
                                <Card.Text>
                                    <div style={{fontSize:14}}>
                                    <br />
                                    <i>{this.props.st.Date}</i>
                                    <div className="float-right">
                                    <Badge variant="primary" style={color1} className=" m-1">{this.props.st.sectionId.toUpperCase()}  </Badge>
                                    {"   "}
                                    <Badge variant="primary" style={color2} className="m-1">{this.props.st.name}  </Badge>
                                    </div>
                                    </div>
                                </Card.Text>
                                </Card.Body>
                            </Card>
                            </div>
    
                            <Modal show={this.state.show} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title style={{fontWeight:"500"}}>
                                <strong>{this.props.st.name}</strong><br />
                                {this.props.st.webTitle}
                            </Modal.Title>
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
    
            else{
                return(
                    <Nav.Link style={{display:"none"}} as={Link} to="/favourite" href="/Favourite" />
                )
                
            }


        }

        
        
    }
}

export default Favourite_card
