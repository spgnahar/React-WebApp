import React from 'react'
import {  Card } from 'react-bootstrap';
import { MdShare } from "react-icons/md";
import Truncate from 'react-truncate';
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import { Redirect } from 'react-router-dom';
import {EmailShareButton, FacebookShareButton,TwitterShareButton} from "react-share";
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';

class Carder extends React.Component{

    constructor(){
		super();
		this.state={
            cardd:false,
            show:false
		 };
        this.mods =this.mods.bind(this)
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
    
        
        mods(event){
            this.setState({
                cardd:true
            });
                
        } 
    
    
    render(){
        var carry=""
        if(this.props.news===true)
            carry="guardian"
        else
            carry="newyorkk"

        if(this.state.cardd===true){
            return(
                <Redirect push to={"/article/"+carry + this.props.shrey.id} />
            )
        }

        else{
            const sec=this.props.shrey.sectionId;
            const color1=
            {
                backgroundColor : "",
                color : ""
            };
            
            if(sec==='world'){ color1.backgroundColor='#7c4eff'; color1.color='white'}
            else if(sec==='politics') {color1.backgroundColor='#419488'; color1.color='white'}
            else if(sec==='business') {color1.backgroundColor='#4696ec'; color1.color='white'}
            else if(sec==='technology') {color1.backgroundColor='#cedc39'; color1.color='black'}
            else if(sec==='sport' || sec=='sports') {color1.backgroundColor='#f6c244'; color1.color='black'}
            else if(sec==='guardian') {color1.backgroundColor='#142849'; color1.color='white'}
            else if(sec==='nytimes') {color1.backgroundColor='#dddddd'; color1.color='black'}
            else  {color1.backgroundColor='#6e757c'; color1.color='white'}

            return(
    
            <>    
                <Card  className="m-3 shadow-lg" onClick={this.mods}>
                    
                    <Card.Body className="row" >
                        <div className="col-md-3"><Card.Img className="img-thumbnail" src={this.props.shrey.Image} /></div>
                        <div className="col-md-9">

                            <Card.Title style={{fontWeight:"610"}}><i>{this.props.shrey.webTitle} </i> {"  "} <MdShare onClick={this.handleShow} /> </Card.Title>
                            <Card.Text>
                            <Truncate lines={3} ellipsis={ <span >... </span> }>
                                {this.props.shrey.Description}
                            </Truncate>

                            <div ><br /><i className="float-left">{this.props.shrey.Date.split('T')[0] }</i>
                            <h5 className="float-right"><Badge variant="primary" style={color1} className="float-right">{this.props.shrey.sectionId.toUpperCase()}</Badge></h5></div>
                            </Card.Text>
                        </div>
                    </Card.Body>  
                </Card>

                <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title style={{fontWeight:"500"}}>{this.props.shrey.webTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                <div style={{textAlign:"center",fontSize:"1.3rem", fontWeight:"500"}} className="mb-1 mt-0"> Share Via</div> 
                    <div style={{display:"flex"}}>
                    
                <FacebookShareButton className='col-md-4' url={this.props.shrey.URL} hashtag='#CSCI_571_NewsApp'><FacebookIcon round={true} /></FacebookShareButton>
                <TwitterShareButton className='col-md-4' url={this.props.shrey.URL} title={this.props.shrey.webTitle} hashtags={['CSCI_571_NewsApp']} ><TwitterIcon round={true} /></TwitterShareButton>
                <EmailShareButton className='col-md-4' subject={'#CSCI_571_NewsApp'} body={this.props.shrey.webTitle}><EmailIcon round={true} /></EmailShareButton>
                </div></Modal.Body>
                </Modal>
            </> 

            )
        }


        
    }
    
} 

export default Carder