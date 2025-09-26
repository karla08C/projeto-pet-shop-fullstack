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
              <h1>Nossos Serviços</h1>
              <img src={pet1} alt="Consultas" className="img-responsive" />
              <header>
                <p>No Pet Shop Feliz, o cuidado com seu animal de estimação vai muito além da estética. Nossos serviços são pensados para o bem-estar e a tranquilidade dele, garantindo uma experiência segura, agradável e completa.</p>
              </header>
              <p>
                Nossos Serviços Principais

                Banho e Tosa: Oferecemos um tratamento completo, com produtos de alta qualidade e técnicas que respeitam a sensibilidade e o tipo de pelo de cada pet.
                Consultas Veterinárias: Contamos com uma equipe de veterinários especializados para cuidar da saúde do seu melhor amigo, oferecendo diagnósticos, tratamentos e orientações personalizadas.
              </p>
              <p>
                Infraestrutura e Diferenciais

                Nosso espaço é totalmente preparado para receber seu pet com conforto e segurança. Temos ambientes climatizados e áreas de espera separadas para cães e gatos, minimizando o estresse e proporcionando uma experiência tranquila para todos.
              </p>
              <section>
                <header>
                  <h3>Outros Serviços</h3>
                </header>
                <p>
                  Além dos serviços principais, oferecemos uma gama de opções para atender todas as necessidades do seu pet, como vacinação, exames clínicos e estética personalizada.
                </p>
              </section>
              <section>
                <header>
                  <h3>Nossa Missão</h3>
                </header>
                <p>
                  Cuidar do seu pet é a nossa missão e nossa paixão. Trabalhamos com responsabilidade, empatia e dedicação para garantir que seu animal de estimação tenha a vida feliz e saudável que ele merece.
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
