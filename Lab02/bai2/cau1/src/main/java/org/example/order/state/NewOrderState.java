package org.example.order.state;

import org.example.OrderContext;

public class NewOrderState implements OrderState {
    @Override
    public void handle(OrderContext order) {
        System.out.println(" Đơn hàng mới: kiểm tra thông tin...");
        order.setState(new ProcessingState());
    }
}

