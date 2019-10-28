import React, { Component } from 'react';
import {MovieBrowserProvider} from './context/MovieBrowserContext';
import {MovieBrowserContext} from './context/MovieBrowserContext';
import './App.css';
import MoviesGrid from './components/MoviesGrid'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputSearchValue: "",
      inputSearchValueUpdated: false,
    };
  }

  handleInputSearch(event) {
    event.preventDefault();
    this.setState({
      inputSearchValue: event.target.value,
    })
  }

  render() {
    return (
      <MovieBrowserProvider>
        <MovieBrowserContext.Consumer>
          {(context) => {
            var {handleType, handleFetch} = context;
            var {title, type, data} = context.state;

            return(
                <div className="App">
                  <nav className = {this.state.inputSearchValue.length > 0 ? "navbar-one navbar-dark" : "navbar-two navbar-dark"} >
                    <h3>Movies & series</h3>
                    <form className= {this.state.inputSearchValue.length > 0 ? "my-2 my-lg-0" : "center my-2 my-lg-0"} >
                      <input
                          className="form-control mr-sm-2"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          value={this.state.inputSearch}
                          onChange={  this.handleInputSearch.bind(this)} />
                      <p className="btn btn-outline-light my-2 my-sm-0"
                         onClick={()=>{
                           this.state.inputSearchValue.length>=3 ?
                               handleFetch(this.state.inputSearchValue)
                               : alert("La busqueda debe ser maayor a 3 letras")}}>
                        Search
                      </p>
                      <br/>
                      <div className="m-2">
                        <label className="mx-3 radio">
                          <input type="radio" name="type" checked = {type === "movie"}  onChange={()=>{handleType("movie")}}/> Movie
                        </label>
                        <label className="mx-3">
                          <input type="radio" name="type" checked = {type === "series"} onChange={()=>{handleType("series")}} /> Serie
                        </label>
                      </div>
                    </form>
                  </nav>

                  {
                    data.length > 0 ?
                        <MoviesGrid/>
                        :
                        <span></span>
                  }
                </div>
              )
            }}
          </MovieBrowserContext.Consumer>
        </MovieBrowserProvider>

    );
  }
}

export default App;
