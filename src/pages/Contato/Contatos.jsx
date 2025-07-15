import React from 'react';
import './Contatos.css';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from 'react-icons/fa';

function Contatos() {
  return (
    <section id="main" className="contato-section">
      <div className="container">
        <div className="order-box">
          <article className="box post">
            <header>
              <h1>🐾 Nos encontre através de: 🐾</h1>
            </header>

            <div className="social-icons">
              <a href="#" className="icon">
                <FaFacebookF />
              </a>
              <a href="#" className="icon">
                <FaInstagram />
              </a>
              <a href="#" className="icon">
                <FaLinkedinIn />
              </a>
              <a href="#" className="icon">
                <FaWhatsapp />
              </a>
            </div>

            <ul className="contact">
              <li>
                <h3>Endereço</h3>
                <p>
                  Rua da sorte 002, 00102-003
                  <br />
                  Bairro Papicu <br />
                  Fortaleza - CE
                </p>
              </li>
              <li>
                <h3>Email</h3>
                <p>
                  <a href="mailto:contato@pet.com.br">contato@pet.com.br</a>
                </p>
              </li>
              <li>
                <h3>Contato</h3>
                <p>(85) 3200-0001 / (85) 3100-0002</p>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Contatos;
