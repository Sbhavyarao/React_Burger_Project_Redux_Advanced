import React , { Component } from "react";
import { Route , Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ContactData from '../Checkout/ContactData/ContactData';
import CheckoutSummary from '../../Components/Order/CheckoutSummary/CheckoutSummary';



class Checkout extends Component {

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }

    render(){
        let summary = <Redirect to="/"/>

        if(this.props.ings) {
            summary = <div>
                <CheckoutSummary 
                    ingredients = {this.props.ings}
                    checkoutCancelled = {this.checkoutCancelledHandler}
                    checkoutContinued = {this.checkoutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    component ={ContactData}/> 
            </div>
        }
        return summary;
    }

}

const mapStateToProps = state => {
    return {
        ings : state.burgerBuilder.ingredients,
        price : state.burgerBuilder.totalPrice
    }
}
export default connect(mapStateToProps)(Checkout);