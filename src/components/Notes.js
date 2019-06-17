import React, { Component } from 'react';
import firebase from './firebase.js';
import jump from 'jump.js';
import { CircleArrow as ScrollUpButton } from 'react-scroll-up-button';

import AddSchool from './AddSchool.js';

class Notes extends Component {
  constructor() {
    super();
    this.focusHere = React.createRef();

    this.state = {
      // list of all bookmarked items in firebase
      bookmarkList: [],
      //  user items are the editable inputted data for each school in the form fields
      userNote: '',
      userName: '',
      userAddress: '',
      userCategory: '',

      // class name toggle of modal status
      modalOpen: 'close',
      // the id of the selected school to be edited
      selectedId: ''
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // sets focus to to the item
    if(this.state.modalOpen !== prevState.modalOpen) {
      this.focusHere.current.focus();
    }
    // this.focusHere.current.focus();

  }

  componentDidMount() {
    const dbRef = firebase.database().ref();
    // pulls all data from firebase and listens for change
    dbRef.on('value', response => {
      const data = response.val();
      const updateBookmark = [];
      for (let item in data) {
        updateBookmark.push({
          key: item,
          name: data[item].name,
          address: data[item].address,
          id: data[item].id,
          note: data[item].note,
          category: data[item].category
        });
      }
      this.setState({
        bookmarkList: updateBookmark
      });
    });
  }

  // handle change for form
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // handle submit of form
  handleSubmit = e => {
    const dbRef = firebase.database().ref(this.state.selectedId);

    // if the user inputs are not empty then write input into firebase at corresponding data node
    if (this.state.userName !== '') {
      dbRef.child('name').set(this.state.userName);
    }
    if (this.state.userAddress !== '') {
      dbRef.child('address').set(this.state.userAddress);
    }
    if (this.state.userCategory !== '') {
      dbRef.child('category').set(this.state.userCategory);
    }
    if (this.state.userNote !== '' && this.state.userNote !== undefined) {
      dbRef.child('note').set(this.state.userNote);
    }

    // close the modal
    this.closeModal();

    // clears the inputs
    this.setState({
      userNote: '',
      userAddress: '',
      userName: '',
      userCategory: ''
    });

    e.preventDefault();
  };

  // edit note function
  editNote = key => {
    // finds the note to the edited by it's key
    const found = this.state.bookmarkList.find(item => item.key === key);

    // opens the modal with the corresponding data in the form fields
    this.setState({
      modalOpen: 'open',
      selectedId: key,
      userName: found.name,
      userAddress: found.address,
      userNote: found.note,
      userCategory: found.category
    });
  };

  // remove note function from the database
  removeBookmark = key => {
    const dbRef = firebase.database().ref(key);
    dbRef.remove();
  };

  // close modal
  closeModal = () => {
    this.setState({
      modalOpen: 'close'
    });
  };

  // jump scroll
  handleScroll = () => {
    jump('.inputSchoolForm', {
      duration: 1000,
      a11y: true
    });
  };

  render() {
    return (
      <div className="noteContainer">
        <div className="wrapper">
          <div className="bookmarks">
            <h2>BOOKMARKS</h2>
          </div>
          <button onClick={this.handleScroll} className="addSign">
            <i className="fas fa-plus" aria-hidden="true" />
            <p>Add Institution</p>
          </button>
        </div>

        <div className={`modalWrapper ${this.state.modalOpen}`}>
          <div className="detailsOverlay" />

          <div className="detailsModal">
            {/* close modal button */}
            <button onClick={this.closeModal} className="closeButton">
              <i className="fas fa-times" aria-label="close modal" />
            </button>

            <form action="" className="editForm" onSubmit={this.handleSubmit}>
              <label htmlFor="name">Name of Institution:</label>
              <input
                type="text"
                id="name"
                name="userName"
                onChange={this.handleChange}
                value={this.state.userName}
                ref={this.focusHere}
              />

              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="userAddress"
                onChange={this.handleChange}
                value={this.state.userAddress}
              />

              <fieldset className="inputFieldContainerRadio">
                <legend className="visuallyHidden">Category:</legend>

                <input
                  className="radioButtonDot "
                  type="radio"
                  name="userCategory"
                  id="college"
                  value="College"
                  onChange={this.handleChange}
                />
                <label htmlFor="college">College</label>
                <input
                  className="radioButtonDot"
                  type="radio"
                  name="userCategory"
                  id="university"
                  value="University"
                  onChange={this.handleChange}
                />
                <label htmlFor="university">University</label>
                <input
                  className="radioButtonDot "
                  type="radio"
                  name="userCategory"
                  id="tradeSchool"
                  value="Trade School"
                  onChange={this.handleChange}
                />
                <label htmlFor="tradeSchool">Trade School</label>
              </fieldset>

              <label htmlFor="addNote">Add Note</label>
              <textarea onChange={this.handleChange} value={this.state.userNote} name="userNote" />

              <input className="generalButton" type="submit" value="enter" />
            </form>
          </div>
        </div>
        <ul className="notes wrapper">
          {this.state.bookmarkList.map(item => {
            return (
              <li key={item.key} className="singleNote singleContent" tabIndex="0">
                <div className="textWrapper">
                  <p className="schoolName">Institution: {item.name}</p>
                  <p className="address"> Address: {item.address}</p>
                  <p className="category">Category: {item.category}</p>
                  <p className="note"> Note: {item.note}</p>
                </div>

                <button
                  className="generalButton"
                  onClick={() => {
                    this.editNote(item.key);
                  }}
                >
                  <i className="fas fa-pen" aria-hidden="true" />Edit
                </button>

                <button
                  className="generalButton"
                  onClick={() => {
                    this.removeBookmark(item.key);
                  }}
                >
                  <i className="fas fa-trash-alt" aria-hidden="true" />Delete
                </button>
              </li>
            );
          })}

          <ScrollUpButton
            AnimationDuration={500}
            ShowAtPosition={350}
            style={{
              fill: `#073330`,
              height: 30,
              width: 30,
              right: 15,
              border: `3px solid #073330`,
              background: `rgba(255, 255, 255, 0.848)`
            }}
          />
        </ul>

        <AddSchool />
      </div>
    );
  }
}

export default Notes;
