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
          <h1 id="h1">🐾 História do Pet Shop Feliz 🐾</h1>
          <p>
            Há 10 anos, nasceu um sonho: criar um lugar onde os animais fossem
            tratados com carinho de verdade...
          </p>
          <p>
            Tudo começou com um pequeno espaço e uma grande paixão pelos
            animais...
          </p>

          <div className="galery">
            <figure>
              <img src={petshopImg2} alt="Fachada antiga do Pet Shop Feliz" />
              <figcaption style={{ textAlign: 'center' }}>
                Nos primeiros anos do Pet Shop Feliz
              </figcaption>
            </figure>
          </div>

          <p>O boca a boca fez o Pet Shop Feliz crescer...</p>
          <p>Hoje, após uma década de história...</p>
          <p>E seguimos assim, dia após dia...</p>

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
