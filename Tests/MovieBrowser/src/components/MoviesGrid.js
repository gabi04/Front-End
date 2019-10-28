import React, { Component } from 'react';
import {MovieBrowserContext} from '../context/MovieBrowserContext';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'


const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        width: '60vw',
        height: '70vh',
    }
};

Modal.setAppElement(document.getElementById('modal'))

class MoviesGrid extends Component {
    constructor() {
        super();

        this.state = {
            movie: [],
            modalIsOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(fetchById, id) {
        fetchById(id);
        this.setState({
            modalIsOpen: true,
        });
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    handlePagination(num_pages){
        var Pagination = [];
        return Pagination;
    }

    render() {
        return(
            <MovieBrowserContext.Consumer>
                {(context) => {
                    var {handleType, handleFetch, fetchById} = context;
                    var {title, type, data, totalResults, movie, loading} = context.state;
                    var num_pages;

                    if(totalResults<100){
                        totalResults%10 == 0 ?
                            num_pages = totalResults/10
                            :
                            num_pages = totalResults/10 +1
                    }else{
                        num_pages = 10;
                    }

                    var num_pages_array = new Array(parseInt(num_pages,10));
                    num_pages_array.fill(1);

                    var items = [];
                    for (let number = 1; number <= num_pages; number++) {
                        items.push(
                            <Pagination.Item onClick={()=>{handleFetch(title, number)}}>
                                {number}
                            </Pagination.Item>,
                        );
                    }
                    return(
                        <div className="container-fluid">
                            {
                            loading ?
                                <i>cargando ...</i>
                            :
                                <div>
                                    <Modal
                                        isOpen={this.state.modalIsOpen}
                                        onRequestClose={this.closeModal}
                                        style={customStyles}
                                    >
                                        <div class="row">
                                            <div className="col-6">
                                                <img className="imgModal" src={movie.Poster}/>
                                            </div>
                                            <div className="col-6">
                                                <h5>{movie.Title}</h5>
                                                <i>{movie.Year}</i>
                                                <p>{movie.Rated}</p>
                                                <p>{movie.Genre}</p>
                                                <p>{movie.Actors}</p>
                                                <p>{movie.Plot}</p>
                                            </div>

                                        </div>

                                        <button  className="btn btn-dark" onClick={this.closeModal}>close</button>

                                    </Modal>
                                    <h5 className="left m-2 ">{data.length} totalResults for "{type} serch"</h5>

                                    <div id="MoviesGrid" className="row">
                                        {
                                            data.map((item) => (
                                                <div key={item.imdbID} className="col-2" onClick={()=>{this.openModal(fetchById, item.imdbID)}}>
                                                    <img className="imgGrid" src={item.Poster} alt={item.Title} />
                                                    <h5>{item.Title}</h5>
                                                    <i>{item.Year}</i>
                                                </div>
                                            ))
                                        }
                                    </div>


                                    <Pagination style={{'position':'relative', 'left':'30%'}}>
                                        <Pagination.First />
                                        <Pagination.Prev />
                                        <Pagination.Ellipsis />
                                        {items}
                                        <Pagination.Ellipsis />
                                        <Pagination.Next />
                                        <Pagination.Last />

                                    </Pagination>
                                </div>
                            }
                        </div>
                    )
                }}
            </MovieBrowserContext.Consumer>
        )
    }
}

export default MoviesGrid;
