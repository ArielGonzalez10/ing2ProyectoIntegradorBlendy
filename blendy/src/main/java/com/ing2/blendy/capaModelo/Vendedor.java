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
@DiscriminatorValue("3")
public class Vendedor extends Usuario {
    private String nroLegajo;
    private String dni;
}