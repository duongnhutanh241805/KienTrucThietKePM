package org.example.order.state;

import org.example.OrderContext;

public interface OrderState {
    void handle(OrderContext order);
}
