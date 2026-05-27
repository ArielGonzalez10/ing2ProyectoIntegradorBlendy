package com.ing2.blendy.capaModelo;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Entity
@DiscriminatorValue("1")
public class Administrador extends Usuario {

}