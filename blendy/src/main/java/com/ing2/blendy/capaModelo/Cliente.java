package com.ing2.blendy.capaModelo;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Getter
@Setter
@Entity
@DiscriminatorValue("2")
public class Cliente extends Usuario {
    private int nroCliente;
}