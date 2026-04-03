package com.ing2.blendy.capaNegocio;
import com.ing2.blendy.capaModelo.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;


@Service
public class JwtService {

    // 1. Define una clave secreta segura (En producción, esto va en application.properties)
    private static final String SECRET_KEY = "tu_clave_secreta_super_larga_y_segura_de_al_menos_32_caracteres";

    // Tiempo de vida del token (ej. 24 horas en milisegundos)
    private static final long EXPIRATION_TIME = 86400000;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }


    public String generarToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getCorreoElectronico()) // Identificador principal
                .setIssuedAt(new Date())        // Fecha de creación
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Fecha de vencimiento
                .claim("nombre", usuario.getNombre()) // Puedes agregar datos extra (Claims)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}