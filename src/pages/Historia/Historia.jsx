import React from 'react';
import './Historia.css'; // Lembre-se de criar esse CSS

function Historia() {
  return (
    <section id="main" className="historia-section">
      <div className="container-historia">
        <div className="order-box">
          <article className="boxH post">
            <header>
              <h1>🐾 Nossa História 🐾</h1>
            </header>
            <p>
              Desde a sua fundação em 2025, a pet sempre teve seus valores bem
              definidos: amor pelos animais, qualidade dos produtos e excelência
              no atendimento. Idealizada por amigos, a empresa nasceu com a
              missão de ser mais do que um pet shop online – um parceiro de
              confiança para todos os tutores. Acreditamos que cada pet é único
              e merece o melhor cuidado, por isso, dedicamos tempo e atenção na
              seleção de cada item do nosso catálogo. Nossa história é
              construída sobre a confiança dos nossos clientes e o nosso
              compromisso contínuo em superar suas expectativas. Olhamos para o
              futuro com a mesma paixão do início, buscando sempre novas formas
              de fortalecer o vínculo entre humanos e animais e de contribuir
              para um mundo pet mais feliz e saudável.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Historia;
