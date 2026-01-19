package org.example.order.decorator;

public class Insurance extends OrderDecorator {

    public Insurance(OrderService order) {
        super(order);
    }

    @Override
    public double cost() {
        return order.cost() + 30;
    }
}
