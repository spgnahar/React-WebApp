import React from 'react'
import {Container} from 'react-bootstrap'
import SearchCard from './SearchCard'
import BounceLoader from "react-spinners/BounceLoader";
import { Redirect } from 'react-router-dom';

import {  Navbar, Nav, Form } from 'react-bootstrap';
import './index.css';
import {Link} from 'react-router-dom';
import AsyncSelect  from 'react-select/async';
import _ from "lodash";
import { FaRegBookmark } from "react-icons/fa";
import ReactTooltip from 'react-tooltip'

class SearchPage extends React.Component{
    constructor(props){
        super(props)
        this.state={
            apiRes:"",
            apiRes1:"",
            store:[],
            carr:"",
            results: [],
			redirect:false,
            option:"",
            random:false,
            name:""
        }
        this.storing=this.storing.bind(this)
        this.storing=this.storing.bind(this)
        this.handleSearchChange=this.handleSearchChange.bind(this)
        this.find_result=this.find_result.bind(this)
        this.callApi=this.callApi.bind(this)
    }

    storing(tank){
        this.setState({
            carr:tank
        })
    }

    callApi(){
        var temp=window.location.href.substring(window.location.href.indexOf('SearchPage/')+11)
        this.setState({
            name: temp.substring(5)
        })


            var url="https://newsapp-backend.appspot.com/guardian/search"+temp.toString();
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
    
            var url1="https://newsapp-backend.appspot.com/newyork/search"+temp;
            fetch(url1)
            .then(response => {
                if(response.status!==200){
                    throw new Error("File not Recieved")
                }
                else return(response.json());
            })
            .then(data1 => {
                this.setState({
                    apiRes1:data1
                })
            })
    }

    componentDidMount(){
        this.callApi()
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.name!==(window.location.href.substring(window.location.href.indexOf('SearchPage/')+16).toString())){
            this.setState({
                apiRes:null,
                apiRes1:null

            })
            this.callApi()
        }
           
    }

    handleSearchChange = async (inputValue ) => {
		console.log(inputValue)
	  try {
		const response = await fetch(
		  'https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q='+inputValue,
		  {
			headers: {
			  "Ocp-Apim-Subscription-Key": "Your_KEY"
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

    render(){
        var name= this.state.name

        var temp2;
		temp2=<Navbar collapseOnSelect expand="lg" variant='dark' className='nav_bar'>
            <Form inline >
                <div style={{"width":"15rem","color":"black"}}>
                    <AsyncSelect
                        placeholder="Enter Keyword..."
                        defaultInputValue = {window.location.href.substring(window.location.href.indexOf('SearchPage/')+16)}
                        loadOptions={_.debounce(this.handleSearchChange, 1000, {
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
                    <Nav.Link as={Link} push to="/" href="/Page1" style={{color:"white"}} >Home</Nav.Link>
                    <Nav.Link as={Link} push to="/World" href="/world"  >World</Nav.Link>
                    <Nav.Link as={Link} to="/Politics" href="/Politics" >Politics</Nav.Link>
                    <Nav.Link as={Link} to="/Business" href="/Business" >Business</Nav.Link>
                    <Nav.Link as={Link} to="/Technology" href="/Technology" >Technology</Nav.Link>
                    <Nav.Link as={Link} push to="/Sports" href="/Sports" >Sports</Nav.Link>
                </Nav>
                <Nav>
                <Nav.Link as={Link} to="/favourite" href="/Favourite"><FaRegBookmark color={'white'} data-tip="Bookmark"/></Nav.Link>
               <ReactTooltip effect="solid" place="bottom" />
                {/* <Navbar.Brand >NYTimes</Navbar.Brand> 
                <Navbar.Brand><Switch onChange={this.click} onColor={'#4696ec'} offColor={'#dddddd'} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false}/></Navbar.Brand>
                <Navbar.Brand >Guardian</Navbar.Brand> */}
                </Nav>
                
            </Navbar.Collapse>
        </Navbar>

        if (!this.state.apiRes1 || !this.state.apiRes)
        {
            return(
                <div>
                    {temp2}
                    <div style={{marginLeft:'50%', marginTop:'20%',fontWeight:"600"}} className="d-none d-md-block"><BounceLoader color='#123abc'/> Loading </div>
                </div>
             );
        }
        else{

                if(this.state.apiRes.length===0 && this.state.apiRes1.length===0)
                    return(<div>
                        {temp2}
                        <br />
                        <h5 style={{textAlign:"center"}}> 
                            No relevant search articles found
                        </h5>
                    </div>
                    )

                var carry=""
                var carry1=""

                carry= this.state.apiRes.map(t =>
                    <SearchCard st={t} />
                )
                var carry1= this.state.apiRes1.map(t =>
                    <SearchCard st={t} />
                )
                

                    if(this.state.redirect){
        
                        {this.setState({
                            redirect:false
                        })}
                        return(
    
                            <div>
                                
                                {temp2}
                                <Redirect push to={"/SearchPage/?ids="+ this.state.option.label.toString()} />
                            </div>
                            
                        )
                    }

                else{
                    return(

                        <div>
                            {temp2}
                            <Container fluid>
                                <h4 style={{marginTop:"1%"}}>Results</h4>
                                <div className="row">
                                    {carry}
                                    {carry1}
                                </div>
                
                            </Container>
                        </div>
                        
                    )
                }
                
        }
        
        
    }
}

export default SearchPage
