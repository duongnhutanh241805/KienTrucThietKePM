package org.example;

import org.example.payment.decorator.DiscountDecorator;
import org.example.payment.decorator.FeeDecorator;
import org.example.payment.state.CompletedState;
import org.example.payment.state.PaymentState;
import org.example.payment.state.PendingState;
import org.example.payment.strategy.CreditCardPayment;
import org.example.payment.strategy.PaymentStrategy;

public class Main {
    public static void main(String[] args) {

        double amount = 200;

        System.out.println("=== STATE PATTERN ===");
        PaymentState state = new PendingState();
        state.handle();

        state = new CompletedState();
        state.handle();

        System.out.println("\n=== STRATEGY + DECORATOR ===");
        PaymentStrategy payment = new CreditCardPayment();

        payment = new DiscountDecorator(payment);
        payment = new FeeDecorator(payment);

        payment.pay(amount);
    }
}