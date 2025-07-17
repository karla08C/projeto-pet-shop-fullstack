import React from 'react';
import './Servicos.css';
import { Link } from 'react-router-dom';

import pet1 from '../../assets/imagens/gato.webp';
import pet2 from '../../assets/imagens/pet.jpg';

function Servicos() {
  return (
    <div className="page-wrapper">
      <section id="mains">
        <div className="container-servico">
          {/* Card maior */}
          <div className="col-8">
            <article className="boxservico">
              <h1>🐾Nossos Serviços🐾</h1>
              <img src={pet1} alt="Consultas" className="img-responsive" />
              <header>
                <p>Cuidado completo e carinho para seu pet!</p>
              </header>
              <p>
                No Pet Shop Feliz, oferecemos um atendimento especializado que
                vai além da estética...
              </p>
              <p>
                Todos os nossos serviços são pensados para o bem-estar dos
                animais e a tranquilidade...
              </p>
              <section>
                <header>
                  <h3>Outros Serviços</h3>
                </header>
                <p>
                  Além do banho e tosa, oferecemos consultas com veterinários
                  especializados...
                </p>
                <p>
                  Nosso espaço é climatizado, com áreas separadas para gatos e
                  cachorros...
                </p>
              </section>
              <section>
                <header>
                  <h3>Conclusão</h3>
                </header>
                <p>
                  Cuidar do seu pet é a nossa missão. Trabalhamos com
                  responsabilidade, empatia...
                </p>
              </section>
            </article>
          </div>

          {/* Sidebar menor */}
          <div className="col-4">
            <section className="boxs">
              <img src={pet2} alt="pet" className="img-responsive" />
              <header>
                <h3>Ambiente acolhedor para seu pet</h3>
              </header>
              <p>
                Nosso espaço foi planejado para oferecer tranquilidade,
                segurança e bem-estar...
              </p>
            </section>

            <section className="boxs">
              <header>
                <h3>Serviços mais procurados</h3>
              </header>
              <p>
                Oferecemos soluções completas para cuidar da saúde e da beleza
                do seu pet.
              </p>
              <ul>
                <li>Banho e tosa com estética personalizada</li>
                <li>Vacinação com acompanhamento veterinário</li>
                <li>Consultas e exames clínicos</li>
              </ul>
              <footer>
                <Link to="/agendamento" className="button alt">
                  Agende o serviço ideal para seu pet
                </Link>
              </footer>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}


export default Servicos;
