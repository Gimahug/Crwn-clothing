import { CheckoutContainer, CheckoutHeader, CheckoutBlock, Total } from './checkout.styles';
import { useContext } from 'react';
import { CartContext } from '../../contexts/cart.context';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';

const Checkout = () => {
	const { cartItems, cartTotal } = useContext(CartContext);

	return (
		<CheckoutContainer>
			<CheckoutHeader>
				<CheckoutBlock>
					<span>Product</span>
				</CheckoutBlock>
				<CheckoutBlock>
					<span>Description</span>
				</CheckoutBlock>
				<CheckoutBlock>
					<span>Quantity</span>
				</CheckoutBlock>
				<CheckoutBlock>
					<span>Price</span>
				</CheckoutBlock>
				<CheckoutBlock>
					<span>Remove</span>
				</CheckoutBlock>
			</CheckoutHeader>
				{
					cartItems.map((cartItem => {
						return (
							<CheckoutItem key={cartItem.id} cartItem={cartItem} />
						);
					}))
				}
				<Total>Total: ${cartTotal}</Total>
		</CheckoutContainer>
	);
}

export default Checkout;