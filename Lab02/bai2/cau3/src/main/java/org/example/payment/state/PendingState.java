package org.example.payment.state;

public class PendingState implements PaymentState {
    @Override
    public void handle() {
        System.out.println(" Đang chờ thanh toán...");
    }
}
