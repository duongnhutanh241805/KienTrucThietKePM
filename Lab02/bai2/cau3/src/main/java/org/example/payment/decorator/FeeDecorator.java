package org.example.payment.decorator;

import org.example.payment.strategy.PaymentStrategy;

public class FeeDecorator extends PaymentDecorator {

    public FeeDecorator(PaymentStrategy payment) {
        super(payment);
    }

    @Override
    public void pay(double amount) {
        System.out.println("➕ Phí xử lý: 10");
        payment.pay(amount + 10);
    }
}
