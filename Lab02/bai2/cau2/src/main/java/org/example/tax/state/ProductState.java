package org.example.tax.state;

import org.example.tax.strategy.TaxStrategy;

public interface ProductState {
    TaxStrategy getTaxStrategy();
}
