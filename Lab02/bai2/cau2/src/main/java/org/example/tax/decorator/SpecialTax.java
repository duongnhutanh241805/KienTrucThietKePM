package org.example.tax.decorator;

import org.example.tax.strategy.TaxStrategy;

public class SpecialTax extends TaxDecorator {

    public SpecialTax(TaxStrategy tax) {
        super(tax);
    }

    @Override
    public double calculate(double price) {
        return tax.calculate(price) + 50;
    }
}