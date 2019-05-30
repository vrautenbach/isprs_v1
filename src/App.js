import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';
import logo from './animated_logo0_small.gif';

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('resources');
    this.unsubscribe = null;
    this.state = {
      resources: [],
      search: ''
    };
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onCollectionUpdate = (querySnapshot) => {
    const resources = [];
    querySnapshot.forEach((doc) => {
      const { title, description, date, author, keywords } = doc.data();
      resources.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title, 
        description, 
        date, 
        author, 
        keywords,
      });
    });
    this.setState({
      resources
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    let _resources = this.state.resources;
    let _search = this.state.search.trim().toLowerCase();

    //Search for keywords 
    if (_search.length > 0) {
      _resources = _resources.filter(function(results) 
      {
        if (results.description.toLowerCase().match(_search)) {
            return results.description.toLowerCase().match(_search);
        }
        else if (results.title.toLowerCase().match(_search)) {
            return results.title.toLowerCase().match(_search);
        }
        else if (results.keywords.toLowerCase().match(_search)) {
            return results.keywords.toLowerCase().match(_search);
        }
        else return ;
      });
    }
    
    //Build the list
    return (
      <div class="container">
        <div class="panel panel-default">
          
          <div class="panel-heading">
            <div className="flex-row">
              <div className="flex-panel">
                <Link to="/"><img src={logo} alt="ISPRS Logo" /></Link>
              </div>
              <div className="flex-large">
                <h3 class="panel-title">
                  CATALOGUE FOR GEOSPATIAL EDUCATIONAL RESOURCES <br/><br/>
                </h3>
              </div>
            </div>
          </div>

          <div class="panel-body">
            <h4>
              <Link to="/create" className="btn btn-primary">Add Resource</Link> &nbsp; &nbsp; &nbsp; &nbsp;
              <Link to="/search" className="btn btn-primary">Advance search</Link>
            </h4>
            <br></br>
            <div class="input-group">
              <input type="text" class="form-control" name="search" value={this.state.search} onChange={this.onChange} placeholder="Quick search" />
            </div>
            <br></br>
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Authors</th>
                  <th>Keywords</th>
                </tr>
              </thead>
              <tbody>
                {_resources.map(resource =>{
                  // console.log(resource)
                return(  
                <>
                  <tr>
                    <td><Link to={`/show/${resource.key}`}>{resource.title}</Link></td>
                    <td>{resource.description}</td>
                    <td>{resource.date}</td>
                    <td>{resource.author}</td>
                    <td>{resource.keywords}</td>
                  </tr>
                  </>
                )})}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default App;
