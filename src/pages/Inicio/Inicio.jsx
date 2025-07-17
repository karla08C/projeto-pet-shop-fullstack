import React from 'react';
import { Link } from 'react-router-dom'; // IMPORTAÇÃO do Link
import './Inicio.css';

import inicio1 from '../../assets/imagens/racao.png';
import inicio2 from '../../assets/imagens/higienepet.png';
import inicio3 from '../../assets/imagens/acessorio.jpeg';

function Inicio() {
  return (
    <section id="main">
      <div className="container">
        {/* Seção de Agendamentos */}
        <section>
          <header className="major">
            <h2>🐾Agendamentos🐾</h2>
          </header>
          <div className="row">
            <div className="col-4 col-6-medium col-12-small">
              <section className="box">
                <h3>Novo Agendamento</h3>
                <p>Marque banho, tosa ou consulta veterinária</p>
                <footer>
                  <Link to="/agendamento" className="button alt">
                    Agendar Serviço
                  </Link>
                </footer>
              </section>
            </div>
            <div className="col-4 col-6-medium col-12-small">
              <section className="box">
                <h3>Meus Agendamentos</h3>
                <p>Visualize ou cancele agendamentos existentes</p>
                <footer>
                  <Link to="/agendamento" className="button alt">
                    Ver Agendamentos
                  </Link>
                </footer>
              </section>
            </div>
          </div>
        </section>

        <hr className="linha-divisoria" />
        {/* Seção de Produtos */}
        <section>
          <header className="major">
            <h2>🐾Nossos Produtos🐾</h2>
          </header>
          <div className="row">
            <div className="col-4 col-6-medium col-12-small">
              <section className="box">
                <Link to="/produtos" className="image featured">
                  <img
                    src={inicio1}
                    alt="alimento"
                    className="img-responsive"
                  />
                </Link>
                <h3>Ração Premium</h3>
                <p>Alimento balanceado para todas as raças</p>
                <footer>
                  <Link to="/produtos" className="button alt">
                    Ver Produtos
                  </Link>
                </footer>
              </section>
            </div>
            <div className="col-4 col-6-medium col-12-small">
              <section className="box">
                <Link to="/produtos" className="image featured">
                  <img
                    src={inicio3}
                    alt="acessorio"
                    className="img-responsive"
                  />
                </Link>
                <h3>Acessórios</h3>
                <p>Coleiras, brinquedos e mais</p>
                <footer>
                  <Link to="/produtos" className="button alt">
                    Ver Produtos
                  </Link>
                </footer>
              </section>
            </div>
            <div className="col-4 col-6-medium col-12-small">
              <section className="box">
                <Link to="/produtos" className="image featured">
                  <img src={inicio2} alt="higiene" className="img-responsive" />
                </Link>
                <h3>Higiene</h3>
                <p>Shampoos, perfumes e cuidados</p>
                <footer>
                  <Link to="/produtos" className="button alt">
                    Ver Produtos
                  </Link>
                </footer>
              </section>
            </div>
          </div>
        </section>
        <hr className="linha-divisoria" />
        {/* Seção de Serviços */}
        <section>
          <header className="major">
            <h2>🐾Nossos Serviços🐾</h2>
          </header>
          <div className="row">
            <div className="col-4 col-12-medium">
              <section className="box">
                <i className="icon solid featured fa-shower"></i>
                <h3>Banho Completo</h3>
                <ul className="alt">
                  <li>Hidratação</li>
                  <li>Secagem profissional</li>
                  <li>Perfumação</li>
                </ul>
              </section>
            </div>
            <div className="col-4 col-12-medium">
              <section className="box">
                <i className="icon solid featured fa-cut"></i>
                <h3>Tosa</h3>
                <ul className="alt">
                  <li>Tosa higiênica</li>
                  <li>Tosa na raça</li>
                  <li>Corte de unhas</li>
                </ul>
              </section>
            </div>
            <div className="col-4 col-12-medium">
              <section className="box">
                <i className="icon solid featured fa-stethoscope"></i>
                <h3>Veterinário</h3>
                <ul className="alt">
                  <li>Consultas</li>
                  <li>Vacinação</li>
                  <li>Exames</li>
                </ul>
              </section>
            </div>
          </div>
          <footer>
            <Link to="/servicos" className="button large">
              Ver Todos os Serviços
            </Link>
          </footer>
        </section>
      </div>
    </section>
  );
}

export default Inicio;
