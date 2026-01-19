package org.example.order.strategy;

public class FastShipping implements ShippingStrategy {
    @Override
    public void ship() {
        System.out.println(" Vận chuyển nhanh");
    }
}
