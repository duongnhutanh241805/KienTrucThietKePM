package org.example.order.decorator;

public class BasicOrder implements OrderService {
    @Override
    public double cost() {
        return 100;
    }
}
