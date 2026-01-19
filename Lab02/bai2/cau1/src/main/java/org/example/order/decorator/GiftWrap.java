package org.example.order.decorator;

public class GiftWrap extends OrderDecorator {

    public GiftWrap(OrderService order) {
        super(order);
    }

    @Override
    public double cost() {
        return order.cost() + 20;
    }
}
