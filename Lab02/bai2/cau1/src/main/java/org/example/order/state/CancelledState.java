package org.example.order.state;

import org.example.OrderContext;

public class CancelledState implements OrderState {
    @Override
    public void handle(OrderContext order) {
        System.out.println(" Đơn hàng bị hủy – hoàn tiền.");
    }
}