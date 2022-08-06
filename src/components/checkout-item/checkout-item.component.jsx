import { CheckoutItemContainer, Arrow, RemoveButton, Quantity, ImageContainer, CheckItem } from './checkout-item.styles';
import { useContext } from 'react';
import { CartContext } from '../../contexts/cart.context';

const CheckoutItem = ({cartItem}) => {
	const {name, imageUrl, price, quantity } = cartItem;
	const { clearItemFromCart, addItemToCart, removeItemToCart  } = useContext(CartContext);

	const clearItemHandler = () => clearItemFromCart(cartItem);
	const addItemHandler = () => addItemToCart(cartItem);
	const removeItemHandler = () => removeItemToCart(cartItem);


	return (
		<CheckoutItemContainer>
			<ImageContainer>
				<img src={imageUrl} alt={`$name`} />
			</ImageContainer>
			<CheckItem>{name}</CheckItem>
			<Quantity>
				<Arrow onClick={removeItemHandler}>&#10094;</Arrow>
				<span>{quantity}</span>
				<Arrow onClick={addItemHandler}>&#10095;</Arrow>
			</Quantity>
			<CheckItem>{price}</CheckItem>
			<RemoveButton onClick={clearItemHandler}>&#10005;</RemoveButton>
		</CheckoutItemContainer>
	)
}

export default CheckoutItem;