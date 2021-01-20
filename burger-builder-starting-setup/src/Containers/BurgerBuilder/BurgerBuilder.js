import React , { Component } from "react";
import { connect } from 'react-redux';
import Aux from '../../hoc/auxi';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from "../../Components/UI/Spinner/Spinner";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';



class BurgerBuilder extends Component {

    state = {
        purchasing : false,
        loading : false,
        error : false,
    }

    componentDidMount () {
        console.log(this.props);
        // axios.get('/ingredients.json')
        // .then(response => {
        //     this.setState({
        //         ingredients : response.data
        //     })
        // })
        // .catch(err => {
        //     this.setState({error : true})
        // });
    }

    updatePurchaseState (updatedIngredients) {
        
        const sum = Object.keys(updatedIngredients).map((value , index) =>{
            return updatedIngredients[value];
        }).reduce((sum , ele)=>{
            return sum+ele;
        })
        return  sum>0;
    }
    purchaseHandler = () => {
        this.setState({
            purchasing : true
        })
    }
    purchaseCancelHandler = () => {
        this.setState({
            purchasing : false
        })
    }
    purchaseContinueHandler = () =>{
        this.props.history.push('/checkout');
    }
    render(){
        const disableInfo ={
            ...this.props.ings
        }
        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
 
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingedients can't be loaded</p>: <Spinner/>
        if(this.props.ings){
            burger = <Aux>
                        <Burger ingredients= {this.props.ings}/>
                        <BuildControls disabled = {disableInfo} 
                        purchasable = {this.updatePurchaseState(this.props.ings)}
                        less={this.props.onIngredientRemoved}
                        more= {this.props.onIngredientAdded}
                        price={this.props.price}
                        ordered = {this.purchaseHandler}/>
                    </Aux>
            orderSummary = <OrderSummary ingredients={this.props.ings}
            purchaseCancelled ={this.purchaseCancelHandler}
            purchaseContinued = {this.purchaseContinueHandler}
            totalPrice = {this.props.price}/>
            if( this.state.loading ){
                orderSummary = <Spinner/>
            }
        }
        
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state =>{
    return {
        ings : state.ingredients,
        price : state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded : (ingName)=> dispatch({ type : actionTypes.ADD_INGREDIENT , ingredientName: ingName}),
        onIngredientRemoved : (ingName)=> dispatch({ type : actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder , axios)); 