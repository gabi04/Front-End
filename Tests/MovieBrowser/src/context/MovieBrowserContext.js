import React, {Component} from "react";
import {MovieBrowserState} from "./MovieBrowserState";
import config from "../config.json";

export const MovieBrowserContext = React.createContext();

export class MovieBrowserProvider extends Component {
    constructor(props){
        super(props);
        this.state = MovieBrowserState;
        this.handleTitle = this.handleTitle.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.fetchById = this.fetchById.bind(this);
    }

    handleTitle(newTitle){
        this.setState({
           title: newTitle
        });
    }

    handleType(newType){
        this.setState({
            type: newType
        });
    }

    handleFetch(inputSearchValue, page=1) {
        this.setState({
            title: inputSearchValue,
            loading: true
        })
        var url = `${config.url}/?apikey=${config.apikey}`;
        var query = `&s=${inputSearchValue}&type=${this.state.type}&page=${page}`;
        try {
            fetch(url + query)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    if(!data.Error){
                        this.setState({
                            data: data.Search,
                            totalResults: data.totalResults,
                        })   
                    }else{
                        this.setState({
                            data: [],
                            totalResults: 0,
                        })
                        alert("Something went wrong");
                    }
                })
        } catch (e) {
            this.setState({
                data: [],
                totalResults: 0,
            })
            alert("Something went wrong");
            console.log(e);
        }
        this.setState({
            loading: false
        })
    }

    fetchById(id){
        this.setState({
            loading: true
        })
        var url = `${config.url}/?apikey=${config.apikey}`;
        var query = `&i=${id}`;
        console.log(url);
        try {
            fetch(url + query)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    this.setState({
                        movie: data
                    })
                })
        } catch (e) {
            alert("Something went wrong");
            console.log(e);
        }
        this.setState({
            loading: false
        })
    }

    render() {
        return(
            <MovieBrowserContext.Provider
                value={{
                    state: this.state,
                    handleTitle: this.handleTitle,
                    handleType: this.handleType,
                    handleFetch: this.handleFetch,
                    fetchById: this.fetchById,
                }}>
                {this.props.children}
            </MovieBrowserContext.Provider>
        );
    }
};