import React, { Component } from 'react';

class Search extends Component {
    constructor() {
        super()
        this.state = {
            university: false,
            college: false,
            tradeSchool: false,
            userInstitute: '',
            userInput: '',
            university: '4bf58dd8d48988d1ae941735',
            college: '4bf58dd8d48988d1a2941735',
            trade: '4bf58dd8d48988d1ad941735',
            schoolsList: []
        }
    }

    // calls the API
    handleClick = () => {
        axios.get('https://api.foursquare.com/v2/venues/search', {
            params: {

                // THIS IS ANDREW'S API KEY
                client_id: 'JYPGSEYBVO44BBH553GNVMI1OCUCDFTFZUS2H0X5JLMCMOVY',
                client_secret: 'XBVDWZV2LUQS3RUWTMJJQVJMKZY5HACXHKCGT4ZXVHHXX5K3',
                v: 20190101,
                near: this.state.userInput,

                // categoryID hardcoded currently for university
                categoryId: this.state.userInstitute,
                radius: 25000,
                intent: 'checkin',
                limit: 50,
                // query: 'university'
            }
        }).then(result => {
            // this returns an array of 50 schools
            const regex = /centre|center|park|building|pool|hall|office of le president|division of|department|campus|residence|faculty|campus|public/i
            const schoolsList = result.data.response.venues
            const filteredSchoolList = [];

            schoolsList.forEach(key => {
                const name = key.categories[0].shortName
                if ((name === 'University' || name === 'Community College' || name === 'Trade School') && !(regex.test(key.name))) {
                    filteredSchoolList.push(key)
                }
            })
            console.log(filteredSchoolList)

            this.setState({
                schoolsList: filteredSchoolList,
            })
        }).catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    handleChange = (event) => {
        this.setState({
            userInput: event.currentTarget.value
        })
    }

    getInstitute = (event) => {
        this.setState({
            userInstitute: event.target.getAttribute('value')
        })
    }

    // bookmarks into firebase the selected school
    setBookmarkState = (id) => {
        console.log(id)
        // dbRef.once('value', (response) => {
        //   const data = response.val()
        //   console.log(data)
        // })
        // this.setState({
        //   bookmarkName,
        //   bookmarkAddress,
        //   bookmarkId
        // })
        // push each bookmarked item into firebase

        this.state.schoolsList.map((school) => {
            if (school.id === id) {
                const dbRef = firebase.database().ref();
                dbRef.push({
                    name: school.name,
                    address: school.location.address,
                    id: school.id
                })
            }
        });
    }

    // NEED TO RENAME AND REFACTOR EVERYTHING BELOW HERE!!!!
    // ALL THIS IS FOR RADIO BUTTONS 
    handleClick = (event) => {
        if (event.currentTarget.getAttribute('value') === '4bf58dd8d48988d1ae941735') {
            this.setState({
                university: true,
                college: false,
                tradeSchool: false
            })
        } else if (event.currentTarget.getAttribute('value') === '4bf58dd8d48988d1a2941735') {
            this.setState({
                university: false,
                college: true,
                tradeSchool: false
            })
        } else if (event.currentTarget.getAttribute('value') === '4bf58dd8d48988d1ad941735') {
            this.setState({
                university: false,
                college: false,
                tradeSchool: true
            })
        }
        this.props.getInstitute(event)
    }

    render() {
        return (
            <div className='searchContainer wrapper'>
                <div className='radioButtons'>
                    {this.state.university ?
                        <div className='radioButton selected'>
                            <input type='radio' name='institution' id='university' value='4bf58dd8d48988d1ae941735' selected></input>
                            <label htmlFor="university">University</label>
                        </div>
                        :
                        <div className='radioButton'>
                            <input type='radio' name='institution' id='university' value='4bf58dd8d48988d1ae941735' onClick={this.handleClick}></input>
                            <label htmlFor="university">University</label>
                        </div>}

                    {this.state.college ?
                        <div className='radioButton selected'>
                            <input type='radio' name='institution' id='college' value='4bf58dd8d48988d1a2941735' selected></input>
                            <label htmlFor="college">College</label>
                        </div>
                        :
                        <div className='radioButton'>
                            <input type='radio' name='institution' id='college' value='4bf58dd8d48988d1a2941735' onClick={this.handleClick}></input>
                            <label htmlFor="college">College</label>
                        </div>}

                    {this.state.tradeSchool ?
                        <div className='radioButton selected'>
                            <input type='radio' name='institution' id='tradeSchool' value='4bf58dd8d48988d1ad941735' selected></input>
                            <label htmlFor="tradeSchool">Trade School</label>
                        </div>
                        :
                        <div className='radioButton'>
                            <input type='radio' name='institution' id='tradeSchool' value='4bf58dd8d48988d1ad941735' onClick={this.handleClick}></input>
                            <label htmlFor="tradeSchool">Trade School</label>
                        </div>}
                </div>
                <input type="text" name="search" id="search" onChange={this.props.onChange} />
                <button onClick={this.props.onClick}>Get School List</button>
            </div>
        )
    }
}

export default Search