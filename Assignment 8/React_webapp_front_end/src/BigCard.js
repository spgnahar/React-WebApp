import React from 'react'
import { Card } from 'react-bootstrap';
import {EmailShareButton, FacebookShareButton,TwitterShareButton} from "react-share";
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';
import { FaRegBookmark,FaChevronDown,FaChevronUp, FaReceipt } from "react-icons/fa";
import Comment from './comment'
import './index.css';
import { Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdBookmark,MdBookmarkBorder } from "react-icons/md";
import BounceLoader from "react-spinners/BounceLoader";


import {  Navbar, Nav, Form } from 'react-bootstrap';
import './index.css';
import {Link} from 'react-router-dom';
import {Link as S} from 'react-scroll'
import AsyncSelect  from 'react-select/async';
import _ from "lodash";
// import { FaRegBookmark } from "react-icons/fa";

class BigCard extends React.Component{

    constructor(props){
        super(props);
		this.state={
			apiRes:"",
            expand:false,
            toaster:false,
            results: [],
			redirect:false,
			option:"",
        };
        this.changeThisUp =this.changeThisUp.bind(this)
        this.changeThisDown =this.changeThisDown.bind(this)
        this.bookmark=this.bookmark.bind(this)
        this.bookmarkRemove=this.bookmarkRemove.bind(this)
        this.handleSearchChange=this.handleSearchChange.bind(this)
        this.find_result=this.find_result.bind(this)
        this.myRef = React.createRef();
        this.myRef1=React.createRef();
        this.scroll=this.scroll.bind(this)
    }
    
    componentDidMount(){
        var temp=window.location.href.substring(window.location.href.indexOf('article/')+8)
        var carry=temp.substring(0,8)
        temp=temp.substring(8)
        var url=""
        if(carry ==='guardian')
        
            url="https://newsapp-backend.appspot.com/guardian/detail?url="+temp;
        else
            url="https://newsapp-backend.appspot.com/newyork/detail?url="+temp;
		fetch(url)
		.then(response => {
			if(response.status !==200){
				throw new Error("File not recieved")
			}
			else return(response.json());
		})
		.then(data => {
			this.setState({
				apiRes: data
            })
        })
    }

    handleSearchChange = async (inputValue ) => {
		console.log(inputValue)
	  try {
		const response = await fetch(
		  'https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q='+inputValue,
		  {
			headers: {
			  "Ocp-Apim-Subscription-Key": "YOUR KEY"
			}
		  }
		);
		const data = await response.json();
		const resultsRaw = data.suggestionGroups[0].searchSuggestions;
		const results = resultsRaw.map(result => ({ label: result.displayText, url: result.url }));
		this.setState({ results });
		return results
	  } catch (error) {
		console.error('Error fetching search'+inputValue);
	  }
	};


	find_result(opt){
		this.setState({
			redirect:true,
			option:opt
		})
		
	}

    scroll(ref) {
            ref.current.scrollIntoView({behavior: 'smooth'})
      }

    
    bookmark(){
        toast.configure()
        this.setState({
            toaster:true
        });
        toast("Saving " +this.state.apiRes.webTitle,{
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar:true,
            bodyClassName:'toast-body' ,
            autoClose: 1500,
            transition:Zoom
            
          });
        
        var testObject =this.state.apiRes;
        localStorage.setItem(this.state.apiRes.URL, JSON.stringify(testObject));
    }

    bookmarkRemove(){
        this.setState({
            toaster:false
        });
        localStorage.removeItem(this.state.apiRes.URL)
        toast.configure()
        toast("Removing " +this.state.apiRes.webTitle,{
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar:true,
            bodyClassName:'toast-body' ,
            autoClose: 1500,
            transition:Zoom
            
          });
    }


    changeThisDown(){
        this.setState({
            expand:true
        });
    }


    changeThisUp(){
        this.setState({
            expand:false
        });
    }

    render(){
        var exp="",col="",solid

        var temp2=<Navbar collapseOnSelect expand="lg" variant='dark' className='nav_bar' id="navb" >
        <Form inline >
            <div style={{"width":"15rem","color":"black"}}>
                <AsyncSelect
                    placeholder="Enter Keyword..."
                    loadOptions={_.debounce(this.handleSearchChange, 1500, {
                        leading: true
                    })}
                    results={this.state.results}
                    onChange={opt => this.find_result(opt)}
                />
            </div>
        </Form>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" >
                <Nav.Link as={Link} push to="/" href="/Page1" >Home</Nav.Link>
                <Nav.Link as={Link} push to="/World" href="/world"  >World</Nav.Link>
                <Nav.Link as={Link} to="/Politics" href="/Politics" >Politics</Nav.Link>
                <Nav.Link as={Link} to="/Business" href="/Business" >Business</Nav.Link>
                <Nav.Link as={Link} to="/Technology" href="/Technology" >Technology</Nav.Link>
                <Nav.Link as={Link} push to="/Sports" href="/Sports" >Sports</Nav.Link>
            </Nav>
            <Nav>
            <Nav.Link as={Link} to="/favourite" href="/Favourite"><FaRegBookmark color={'white'}/></Nav.Link>
            {/* <Navbar.Brand >NYTimes</Navbar.Brand> 
            <Navbar.Brand><Switch onChange={this.click} onColor={'#4696ec'} offColor={'#dddddd'} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false}/></Navbar.Brand>
            <Navbar.Brand >Guardian</Navbar.Brand> */}
            </Nav>
            
        </Navbar.Collapse>
    </Navbar>

        if (!this.state.apiRes.Image) {
			return(<div>{temp2} <div style={{marginLeft:'50%', marginTop:'20%',fontWeight:"600"}} className="d-none d-md-block"><BounceLoader color='#123abc'/> Loading </div></div>);
        }
        
        else{

            if(this.state.expand){
                //exp= <div>{this.state.apiRes.Description}</div>
                exp=<div style={{textAlign:"justify"}}><p >{this.state.apiRes.small} </p>
                <p id="para">{this.state.apiRes.big}</p></div>
                // <p ref={this.myRef} className="scrollToHere">[1] ...</p>
                // col= <FaChevronUp  onClick={this.changeThisUp}/>
                col= <S to="navb"  smooth={true}>
                        <FaChevronUp  onClick={this.changeThisUp}/>
                    </S> 
            }
            else{
                exp=<div style={{textAlign:"justify"}}><p> {this.state.apiRes.small}</p> 
                <div id="para"><p style={{display:"none"}}>{this.state.apiRes.big}</p></div></div>
                if(this.state.apiRes.big.length===0)
                    col=<></>
                else{
                    //col=<FaChevronDown className="footnote" onClick={this.changeThisDown}/>
                    col= <S to="para"  smooth={true}>
                        <FaChevronDown onClick={this.changeThisDown}/>
                    </S> 
                }
                    
            }
    
            if(this.state.toaster || localStorage.getItem(this.state.apiRes.URL)){
                solid=<MdBookmark size={22} color={'red'} onClick={this.bookmarkRemove}/>
            }
            else{
                solid=<MdBookmarkBorder size={22} color={'red'} onClick={this.bookmark}/>
            }

            if(this.state.redirect){
                return(
                    <div>
                        {temp2}
                    <Card className="m-3 shadow-lg">
                        <Card.Body>
                            <Card.Title style={{fontWeight:"1.5rem"}}><i>{this.state.apiRes.webTitle}</i></Card.Title>
                            <Card.Text>
        
        
                            <div class="d-flex bd-highlight mb-3">
                            <div class="mr-auto p-2 bd-highlight"><i>{this.state.apiRes.Date}</i></div>
                            <div class="p-2 bd-highlight">
                                <FacebookShareButton data-tip='Facebook' url={this.state.apiRes.URL} quote={this.state.apiRes.webTitle} hashtag='#CSCI_571_NewsApp'><FacebookIcon size={24} round={true} /></FacebookShareButton>
                                <TwitterShareButton data-tip='Twitter' url={this.state.apiRes.URL} title={this.state.apiRes.webTitle} hashtags={['CSCI_571_NewsApp']} ><TwitterIcon size={24} round={true} /></TwitterShareButton>
                                <EmailShareButton data-tip='Email' subject={'#CSCI_571_NewsApp'} body={this.state.apiRes.webTitle}><EmailIcon size={24} round={true} /></EmailShareButton>
                            </div>
                            <div class="p-2 bd-highlight">
                                <a data-tip='Bookmark'> {solid} </a>
                            </div>
                            </div>
        
                            <ReactTooltip effect="solid" />
                            <Card.Img variant="top" src={this.state.apiRes.Image} />
                            </Card.Text>
                            <Card.Text>
                                {exp}
                            </Card.Text>
                            <Card.Text>
                            {/* <br /> */}
                            <div className="float-right">
                                {col}
                            </div>
                            </Card.Text>
                        </Card.Body>
                       
                    </Card>
        
                    <Comment id={this.state.apiRes.URL} />
                    <Redirect to={"/SearchPage/?ids="+ this.state.option.label.toString()} />
                    
                    </div>
                )
            }

            else{
                return(
                    <div>
                        {temp2}
                    <Card className="m-3 shadow-lg">
                        <Card.Body>
                            <Card.Title style={{fontWeight:"1.5rem"}}><i><h4>{this.state.apiRes.webTitle}</h4></i></Card.Title>
                            <Card.Text>
        
        
                            <div class="d-flex bd-highlight mb-3">
                            <div class="mr-auto p-2 bd-highlight"><h6><i>{this.state.apiRes.Date}</i></h6></div>
                            <div class="p-2 bd-highlight">
                                <a data-tip='Facebook'><FacebookShareButton url={this.state.apiRes.URL} hashtag='#CSCI_571_NewsApp'><FacebookIcon size={24} round={true} /></FacebookShareButton> </a>
                                <a data-tip='Twitter'><TwitterShareButton url={this.state.apiRes.URL} title={this.state.apiRes.webTitle} hashtags={['CSCI_571_NewsApp']} ><TwitterIcon size={24} round={true} /></TwitterShareButton> </a>
                                <a data-tip='Email'><EmailShareButton subject={'#CSCI_571_NewsApp'} body={this.state.apiRes.webTitle}><EmailIcon size={24} round={true} /></EmailShareButton> </a>
                            </div>
                            <div class="p-2 bd-highlight">
                                <a data-tip='Bookmark'> {solid} </a>
                            </div>
                            </div>
        
                            <ReactTooltip effect="solid" />
                            
                            <Card.Img variant="top" src={this.state.apiRes.Image} />
                            </Card.Text>
                            <Card.Text>
                                {exp}
                            </Card.Text>
                            <Card.Text>
                            <div className="float-right">
                                {col}
                            </div>
                            </Card.Text>
                        </Card.Body>
                       
                    </Card>
        
                    <Comment id={this.state.apiRes.URL} />
                    
                    </div>
                )
            }
            

        }

        
    }
}

export default BigCard