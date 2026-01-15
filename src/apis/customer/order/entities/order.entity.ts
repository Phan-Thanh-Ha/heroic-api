export class OrderEntity {
	id!: number;
	uuid!: string;
	orderCode!: string;
	orderDate!: Date;
	deliveryDate?: Date;
	subTotal!: number;
	totalDiscount!: number;
	totalAmount!: number;
	status!: string;
	shippingFee!: number;
	discountCode?: string;
	paymentMethod!: string;
	paymentStatus!: string;
	shippingAddress?: string;
	shippingPhone?: string;
	shippingName?: string;
	customerId!: number;
	createdAt!: Date;
	updatedAt!: Date;
}
