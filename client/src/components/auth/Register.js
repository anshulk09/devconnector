import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authAction';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
    constructor(){
        super();
        this.state ={
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({errors: nextProps.errors});
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }
        this.props.registerUser(newUser, this.props.history);
    }

    render() {
        const { errors } = this.state;

        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Sign Up</h1>
                        <p className="lead text-center">Create your DevConnector account</p>
                        <form noValidate onSubmit={this.onSubmit}>
                            <TextFieldGroup 
                                name="name"
                                placeholder="Name"
                                error={errors.name}
                                onChange={this.onChange}
                                value={this.state.name}
                                //type="text"
                            />
                            <TextFieldGroup 
                                name="email"
                                placeholder="Email Address"
                                error={errors.email}
                                onChange={this.onChange}
                                value={this.state.email}
                                type="email"
                                info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                            />    
                            <TextFieldGroup 
                                name="password"
                                placeholder="Password"
                                error={errors.password}
                                onChange={this.onChange}
                                value={this.state.password}
                                type="password"
                            />
                            <TextFieldGroup 
                                name="password2"
                                placeholder="Confirm Password"
                                error={errors.password2}
                                onChange={this.onChange}
                                value={this.state.password2}
                                type="password"
                            />
                            <input type="submit" className="btn btn-info btn-block mt-4" />
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser : PropTypes.func.isRequired,
    auth : PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        errors: state.errors
    }
}

export default connect(mapStateToProps, { registerUser })(withRouter(Register));