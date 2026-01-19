package org.example.order.strategy;

public class EconomyShipping implements ShippingStrategy {
    @Override
    public void ship() {
        System.out.println(" Vận chuyển tiết kiệm");
    }
}