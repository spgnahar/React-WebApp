import React from 'react';
import { Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import World from './World'
import Politics from './Politics'
import Business from './Business'
import Technology from './Technology'
import Sports from './Sports'
import BigCard from './BigCard'
import Favourite from './Favourite'

import Page1 from './Page1'
import SearchPage from './SearchPage';

class App extends React.Component{
	constructor(props) {
		super(props);
		this.state = { 
			checked: false,
			header:"general"
		 };
		this.handleChange = this.handleChange.bind(this);
		this.changeHeader=this.changeHeader.bind(this)
	}

	changeHeader(info){
		this.setState({
			header:info
		})
	}
	
	 
	handleChange(swi) {
		this.setState({ checked:swi });
	  }

	render(){


		return(
			<div>
				<Route path="/" component={(props) => <Page1 a={this.state.checked}{...props} />} exact />
				<Route path="/world" component={(props) =><World a={this.state.checked}{...props}/>} />
				<Route path="/politics" component={(props) =><Politics a={this.state.checked}{...props}/> } />
				<Route path="/business" component={(props) =><Business a={this.state.checked}{...props}/> } />
				<Route path="/technology" component={(props) => <Technology a={this.state.checked}{...props}/> } />
				<Route path="/sports" component={(props) => <Sports a={this.state.checked}{...props}/>} />

				<Route path="/article" component={()=><BigCard />} />
				<Route path="/favourite" component={()=><Favourite />} />
				<Route path="/SearchPage" component={()=><SearchPage />} />
				
			</div>
		)
	}
	
}

export default App