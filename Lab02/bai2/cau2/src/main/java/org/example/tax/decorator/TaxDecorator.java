package org.example.tax.decorator;

import org.example.tax.strategy.TaxStrategy;

public abstract class TaxDecorator implements TaxStrategy {

    protected TaxStrategy tax;

    public TaxDecorator(TaxStrategy tax) {
        this.tax = tax;
    }
}