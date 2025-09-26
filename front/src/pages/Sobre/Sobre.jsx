import React, { useEffect } from 'react';
import './Sobre.css';
import petshopImg from '../../assets/imagens/petshop.png';
import petshopImg2 from '../../assets/imagens/antes.png';
import petshopImg3 from '../../assets/imagens/depois.png';

function Sobre() {
  useEffect(() => {
    const abrirImagem = (src) => {
      const modal = document.getElementById('imgModal');
      const imagem = document.getElementById('imgAmpliada');
      imagem.src = src;
      modal.classList.add('mostrar');
    };

    const fecharImagem = () => {
      document.getElementById('imgModal').classList.remove('mostrar');
    };

    const imagens = document.querySelectorAll('.galery img');
    imagens.forEach((img) => {
      img.addEventListener('click', () => abrirImagem(img.src));
    });

    return () => {
      imagens.forEach((img) => {
        img.removeEventListener('click', () => abrirImagem(img.src));
      });
    };
  }, []);

  return (
    <>
      {/* Conteúdo principal */}
      <section id="main">
        <article className="about">
          <h3 id="h1">  Mais do que um Pet Shop Online, um Parceria de Confiança </h3>
          <p>
           Fundada em 2015 por um grupo de amigos apaixonados por animais, a pet nasceu com a missão de ser um parceiro de confiança para todos os tutores. Desde o início, nossos valores são claros: amor pelos animais, qualidade dos produtos e excelência no atendimento.</p>

          <p> Acreditamos que cada pet é único e merece o melhor. É por isso que dedicamos tempo e atenção para selecionar cada item do nosso catálogo, garantindo que você encontre apenas produtos de alta qualidade. Nossa história é construída sobre a confiança dos nossos clientes e o compromisso de superar suas expectativas.</p>

           <p>Olhamos para o futuro com a mesma paixão de sempre, buscando fortalecer o vínculo entre humanos e animais e contribuir para um mundo pet mais feliz e saudável.
          </p>
         

          <div className="galery">
            <figure>
              <img src={petshopImg2} alt="Fachada antiga do Pet Shop Feliz" />
              <figcaption style={{ textAlign: 'center' }}>
                Nos primeiros anos do Pet Shop Feliz
              </figcaption>
            </figure>
          </div>

          <p>  O boca a boca fez o Pet Shop Feliz crescer,e hoje, após uma década de história. </p>
          
          <div className="galery">
            <figure>
              <img src={petshopImg3} alt="Nova fachada do Pet Shop Feliz" />
              <figcaption>Fachada moderna após a expansão</figcaption>
            </figure>

            <figure>
              <img src={petshopImg} alt="Donos do Petshop na frente do local" />
              <figcaption>
                Quem fez tudo isso acontecer desde o começo!
              </figcaption>
            </figure>
          </div>
        </article>
      </section>

      {/* Modal de imagem */}
      <div
        id="imgModal"
        className="img-modal"
        onClick={() =>
          document.getElementById('imgModal').classList.remove('mostrar')
        }
      >
        <img
          className="img-modal-content"
          id="imgAmpliada"
          alt="imagem ampliada"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
}

export default Sobre;
