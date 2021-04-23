import React, { Component } from 'react'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';


class CreateProfile extends Component {
    constructor(){
        super();
        this.state ={
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubusername: '',
            bio: '',
            twitter: '',
            facebook: '',
            linkedIn: '',
            youtube: '',
            instagram: '',
            errors: {}
        }
    }
    render() {
        return (
        <div className='create-profiole'>
            <div className='container'>
                <div className='row'> 
                    <div className='col-md-8 m-auto'>
                        <h1 className='display-4 text-center'>Create Your Profile</h1>
                        <p className='lead text-center'>
                            Let's get some information to make your profile stand out.
                        </p>
                        <small className='d-block pb-3'>* = required fields</small>
                    </div>
                </div>                
            </div>            
        </div>
        )
    }
}

CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        errors: state.errors
    }
}

export default connect(mapStateToProps)(CreateProfile)
