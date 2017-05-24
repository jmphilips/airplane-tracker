import React, { Component } from 'react';
import Flights from './home_components/flights';
import Logout from './home_components/logout';
import Search from './home_components/search'

class Home extends Component {
  render() {
    return (
      <div>
        <Logout />
        <p>Welcome {this.props.user.name}</p>
        <Flights />
        <Search />
      </div>
    )
  }
}

export default Home