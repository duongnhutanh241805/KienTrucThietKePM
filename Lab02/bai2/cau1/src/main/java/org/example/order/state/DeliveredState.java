package org.example.order.state;

import org.example.OrderContext;

public class DeliveredState implements OrderState {
    @Override
    public void handle(OrderContext order) {
        System.out.println("Đơn hàng đã được giao.");
    }
}