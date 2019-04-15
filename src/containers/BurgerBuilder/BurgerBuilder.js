import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }
    componentDidMount () {
        this.props.onInitIngredients();
    }
    updatePurchasable (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {return ingredients[igKey];})
            .reduce((sum,el) => {return sum+el;},0);
            return sum>0;
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    
    purchaseContinue = () => {
        this.props.onInitPurchase();
        this.props.isAuth ? this.props.history.push('/checkout') : this.props.history.push('/auth');
    }

    render () {
        const disabledInfo = {...this.props.ingredients};
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        
        let burger = this.props.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded!</p> : <Spinner />
        if(this.props.ingredients) {
            burger = (
                <Aux>
                <Burger ingredients = {this.props.ingredients} />
                    <BuildControls ingredientAdded = {this.props.onIngredientAdded}
                                ingredientRemoved = {this.props.onIngredientRemoved}
                                disabled = {disabledInfo}
                                price = {this.props.price}
                                purchasable = {this.updatePurchasable(this.props.ingredients)}
                                ordered = {this.purchaseHandler}
                                isAuth = {this.props.isAuth}/>
                </Aux>
            );
            orderSummary = <OrderSummary ingredients = {this.props.ingredients} 
                            clicked={this.purchaseCancelHandler} 
                            continued={this.purchaseContinue} 
                            totalprice={this.props.price.toFixed(2)}/>
        }

        return (
            <Aux>
                <Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerReducer.ingredients,
        price: state.burgerReducer.totalPrice,
        error: state.burgerReducer.error,
        isAuth: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ing) => dispatch(actions.addIngredient(ing)),
        onIngredientRemoved: (ing) => dispatch(actions.removeIngredient(ing)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));