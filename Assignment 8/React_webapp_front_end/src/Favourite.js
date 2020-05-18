import React from 'react'
import {Container} from 'react-bootstrap'
import FavCard from './FavCard'

import {  Navbar, Nav, Form } from 'react-bootstrap';
import './index.css';
import {Link} from 'react-router-dom';
import AsyncSelect  from 'react-select/async';
import _ from "lodash";
import { Redirect } from 'react-router-dom';
import { FaBookmark } from "react-icons/fa";


class Favourite extends React.Component{
    constructor(props){
        super(props)
        this.state={
            store:[],
            carr:"",
            results: [],
			redirect:false,
			option:"",
        }
        this.storing=this.storing.bind(this)
        this.handleSearchChange=this.handleSearchChange.bind(this)
        this.find_result=this.find_result.bind(this)
    }

    storing(tank){
        this.setState({
            carr:tank
        })
    }

    componentDidMount(){
        // localStorage.clear()
        let storage=[]
        for(var i=0;i<localStorage.length;i++){
            var x=localStorage.getItem(localStorage.key(i))
            if(x===true || x===false || x==='true' || x==='false')
                continue
            var retrievedObject =JSON.parse(x);
            storage.push(retrievedObject)
        }
        this.setState({
            store:storage
        });
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

        var temp2;
		temp2=<Navbar collapseOnSelect expand="lg" variant='dark' className='nav_bar'>
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
                    <Nav.Link as={Link} push to="/" href="/Page1" style={{color:"white"}} >Home</Nav.Link>
                    <Nav.Link as={Link} push to="/World" href="/world"  >World</Nav.Link>
                    <Nav.Link as={Link} to="/Politics" href="/Politics" >Politics</Nav.Link>
                    <Nav.Link as={Link} to="/Business" href="/Business" >Business</Nav.Link>
                    <Nav.Link as={Link} to="/Technology" href="/Technology" >Technology</Nav.Link>
                    <Nav.Link as={Link} push to="/Sports" href="/Sports" >Sports</Nav.Link>
                </Nav>
                <Nav>
                <Nav.Link as={Link} to="/favourite" href="/Favourite"><FaBookmark color={'white'}/></Nav.Link>
                {/* <Navbar.Brand >NYTimes</Navbar.Brand> 
                <Navbar.Brand><Switch onChange={this.click} onColor={'#4696ec'} offColor={'#dddddd'} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false}/></Navbar.Brand>
                <Navbar.Brand >Guardian</Navbar.Brand> */}
                </Nav>
                
            </Navbar.Collapse>
        </Navbar>
        // localStorage.clear()

        
        if(localStorage.length===1)
            if(this.state.redirect)
                return(
                <div>
                    {temp2}
                    <br />
                    <h5 style={{textAlign:"center"}}> 
                        You have no saved articles
                    </h5>
                    <Redirect to={"/SearchPage/?ids="+ this.state.option.label.toString()} />
                </div>
                )
            else{
                return(
                    <div>
                        {temp2}
                        <br />
                        <h5 style={{textAlign:"center"}}> 
                            You have no saved articles
                        </h5>
                    </div>
                    )
            }
        else{
            const carry= this.state.store.map(t =>
                <FavCard st={t} del={this.storing} />
            )

            
            if(this.state.redirect){
                return(
                        <div>
                            {temp2}
                            <Container fluid>
                                
                                <h4 style={{marginTop:"1%"}}>Favourites</h4>
                                <div className="row">
                                    {carry}
                                </div>
                
                            </Container>
                            <Redirect to={"/SearchPage/?ids="+ this.state.option.label.toString()} />
                        </div>
                        
                        
                );
                
            }
            else{
                return(
                    <div>
                            {temp2}
                            <Container fluid>
                                
                                <h4 style={{marginTop:"1%"}}>Favourites</h4>
                                <div className="row">
                                    {carry}
                                </div>
                
                            </Container>
                            {/* <Redirect to={"/SearchPage/?ids="+ this.state.option.label.toString()} /> */}
                    </div>
                );
            }


           
        }
        
    }
}

export default Favourite
