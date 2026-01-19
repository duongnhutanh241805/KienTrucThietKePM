package org.example.payment.decorator;

import org.example.payment.strategy.PaymentStrategy;

public abstract class PaymentDecorator implements PaymentStrategy {

    protected PaymentStrategy payment;

    public PaymentDecorator(PaymentStrategy payment) {
        this.payment = payment;
    }
}
