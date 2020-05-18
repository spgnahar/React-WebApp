import React from 'react';
import BounceLoader from "react-spinners/BounceLoader";
import Carder from './Carder'



import {  Navbar, Nav, Form } from 'react-bootstrap';
import './index.css';
import Switch from "react-switch";
import {Link} from 'react-router-dom';
import AsyncSelect  from 'react-select/async';
import _ from "lodash";
import { Redirect } from 'react-router-dom';
import { FaRegBookmark } from "react-icons/fa";
import ReactTooltip from 'react-tooltip'


class World extends React.Component {
	constructor(props){
		super(props);
		this.state={
            apiRes:"",
            apiRes1:"",
            checked: JSON.parse(localStorage.getItem('switched')),
			results: [],
			redirect:false,
			option:"",
		};
        // this.get_data =this.get_data.bind(this)
        this.click =this.click.bind(this)
		this.handleSearchChange=this.handleSearchChange.bind(this)
        this.find_result=this.find_result.bind(this)

	}

	componentDidMount(){
        var url="https://newsapp-backend.appspot.com/guardian/section?sec=world";
        console.log('World!')
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
        

        var url1="https://newsapp-backend.appspot.com/newyork/section?sec=world";
		fetch(url1)
		.then(response => {
			if(response.status !==200){
				throw new Error("File not recieved")
			}
			else return(response.json());
		})
		.then(data => {
			
			this.setState({
				apiRes1: data
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

	click(){
		if(this.state.checked==false)
			this.setState({checked:true})
		else
			this.setState({checked:false})
		//this.props.handle(checked)
		
	}

	find_result(opt){
		this.setState({
			redirect:true,
			option:opt
		})
		
	}
	
	render(){
		if(this.state.checked===true){
			localStorage.setItem('switched',true)
		}
		else{
			localStorage.setItem('switched',false)
		}
		
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
				<Nav.Link as={Link} push to="/" href="/Page1"  >Home</Nav.Link>
				<Nav.Link as={Link} push to="/World" href="/world" style={{color:"white"}} >World</Nav.Link>
				<Nav.Link as={Link} push to="/Politics" href="/Politics" >Politics</Nav.Link>
				<Nav.Link as={Link} push to="/Business" href="/Business" >Business</Nav.Link>
				<Nav.Link as={Link} push to="/Technology" href="/Technology" >Technology</Nav.Link>
				<Nav.Link as={Link} push to="/Sports" href="/Sports" >Sports</Nav.Link>
			</Nav>
			<Nav>
			<Nav.Link as={Link} to="/favourite" href="/Favourite"><FaRegBookmark color={'white'} data-tip="Bookmark"/></Nav.Link>
			<ReactTooltip effect="solid" place="bottom"/>
			<Navbar.Brand >NYTimes</Navbar.Brand> 
			<Navbar.Brand><Switch onChange={this.click} onColor={'#4696ec'} offColor={'#dddddd'} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false}/></Navbar.Brand>
			<Navbar.Brand >Guardian</Navbar.Brand>
			</Nav>
			
		</Navbar.Collapse>
	</Navbar>
		
		if (!this.state.apiRes.results) {
			return(
				<div>
					{temp2}
				 	<div style={{marginLeft:'50%', marginTop:'20%',fontWeight:"600"}} className="d-none d-md-block"><BounceLoader color='#123abc'/> Loading </div>
				 </div>
				 );
		}
		else{
			if(this.state.checked===true){
				const abc=this.state.apiRes.results;
				const title = abc.map(r => <Carder shrey={r} news={this.state.checked}/>);
				if(this.state.redirect){
					return(
						<main>
							{temp2}
							{title}
							<Redirect to={"/SearchPage/?ids="+ this.state.option.label.toString()} />
							
						</main>
					);
					
				}
				else{
					return(
						<main>
							{temp2}
							{title}
							
						</main>
					);
				}
			}
			else{
				const abc=this.state.apiRes1.results;
				const title = abc.map(r => <Carder shrey={r} news={this.state.checked}/>);
				if(this.state.redirect){
					return(
						<main>
							{temp2}
							{title}
							<Redirect to={"/SearchPage/?ids="+ this.state.option.label.toString()} />
							
						</main>
					);
					
				}
				else{
					return(
						<main>
							{temp2}
							{title}
						</main>
					);
				}
				
			}	
				
			
		}
		
		
	}
}


export default World