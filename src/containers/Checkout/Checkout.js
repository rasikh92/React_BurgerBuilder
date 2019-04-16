import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';
import {connect} from 'react-redux';

class Checkout extends Component {

    render () {
        let summary = <Redirect to="/"/>
        if(this.props.ingredients) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                <CheckoutSummary ingredients = {this.props.ingredients}
                                checkoutCancelled = {() => this.props.history.goBack()}
                                checkoutContinued = {() => this.props.history.replace('/checkout/contact-data')}/>
                <Route path={this.props.match.path +'/contact-data'} 
                                component = {ContactData}/>
                </div>
            )
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerReducer.ingredients,
        purchased: state.order.purchased
    };
};

export default connect(mapStateToProps)(Checkout);