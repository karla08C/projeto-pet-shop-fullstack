import React from 'react';
import './Produtos.css';

function Produtos() {
const todosOsProdutos = [
  {
    id: 1,
    titulo: 'Arranhador de Gato Torre com Bolinha',
    preco: 79.90,
    descricao: 'Torre de arranhar com várias plataformas e uma bolinha pendurada para entretenimento e afiação de garras.',
    imagem: 'https://agrobees.cdn.magazord.com.br/img/2024/03/produto/623/arranhador-para-gatos-poste-sisal-3-bases-brinquedo-bolinha-preto-agrobees-2.png?ims=fit-in/800x'
  },
  {
    id: 2,
    titulo: 'Túnel Dobrável para Gatos',
    preco: 45.00,
    descricao: 'Túnel interativo e dobrável, perfeito para brincadeiras de esconde-esconde e para estimular a curiosidade do seu gato.',
    imagem: 'https://www.smartpetshop.com.br/cdn/shop/files/T_nel_Dobr_vel_para_Gatos.png?v=1723511751'
  },
  {
    id: 3,
    titulo: 'Conjunto de Varinhas Interativas para Gatos',
    preco: 29.90,
    descricao: 'Variedade de varinhas com penas e outros acessórios para estimular o instinto de caça do seu gato.',
    imagem: 'https://francocenter.com/cdn/shop/products/varinha-interativa-de-penas-para-gatos-conjunto-de-7-pecas-brinquedo-para-pet-gato-felinos-franco-center-595913.jpg?v=1695681808'
  },
  {
    id: 4,
    titulo: 'Brinquedo Dispensador de Ração para Gatos',
    preco: 35.50,
    descricao: 'Brinquedo que dispensa ração ou petiscos, incentivando seu gato a brincar e pensar para conseguir sua recompensa.',
    imagem: 'https://images.unsplash.com/photo-1616854378873-1f1f1d1c8f1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 5,
    titulo: 'Rato de Brinquedo com Catnip',
    preco: 15.00,
    descricao: 'Rato de pelúcia com catnip para atrair e entreter seu gato, estimulando brincadeiras e mordiscadas.',
    imagem: 'https://images.unsplash.com/photo-1590823521360-1e521e1a5e1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 6,
    titulo: 'Bola Interativa com Penas para Gatos',
    preco: 22.00,
    descricao: 'Bola com penas que giram e se movem, despertando a curiosidade e o instinto de caça do seu felino.',
    imagem: 'https://images.unsplash.com/photo-1596854378873-1f1f1d1c8f1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 7,
    titulo: 'Laser Pointer para Gatos',
    preco: 18.00,
    descricao: 'Laser pointer para sessões de brincadeira interativas, estimulando o exercício e o foco do seu gato.',
    imagem: 'https://images.unsplash.com/photo-1514888798-ef22822830b5?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 8,
    titulo: 'Brinquedo de Mola com Bolinha para Gatos',
    preco: 19.90,
    descricao: 'Brinquedo com mola e bolinha na ponta, ideal para o gato bater e perseguir, proporcionando diversão e exercício.',
    imagem: 'https://images.unsplash.com/photo-1549448834-f65590a7e0c4?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 9,
    titulo: 'KONG Classic para Cães',
    preco: 65.00,
    descricao: 'Brinquedo durável de borracha natural, perfeito para rechear com petiscos e manter seu cão entretido e mentalmente estimulado.',
    imagem: 'https://images.unsplash.com/photo-1582234056230-05844431f4b8?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 10,
    titulo: 'Bola de Tênis Atóxica para Cães',
    preco: 12.00,
    descricao: 'Bola de tênis resistente e segura para o seu cão brincar de buscar e mastigar.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 11,
    titulo: 'Corda com Nós para Cães',
    preco: 25.00,
    descricao: 'Corda resistente com vários nós, ideal para brincadeiras de cabo de guerra e para ajudar na higiene bucal do seu cão.',
    imagem: 'https://images.unsplash.com/photo-1563574971-80e9a5e8f4e2?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 12,
    titulo: 'Mordedor de Borracha Resistente para Cães',
    preco: 39.90,
    descricao: 'Mordedor de borracha atóxica e durável, perfeito para cães com mordida forte, ajudando a aliviar o estresse e a limpar os dentes.',
    imagem: 'https://images.unsplash.com/photo-1596854378873-1f1f1d1c8f1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 13,
    titulo: 'Frisbee para Cães',
    preco: 18.00,
    descricao: 'Frisbee leve e resistente para brincadeiras ao ar livre, incentivando o exercício e a interação com seu cão.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 14,
    titulo: 'Brinquedo de Pelúcia com Apito para Cães',
    preco: 28.00,
    descricao: 'Brinquedo de pelúcia macio com apito interno para estimular o interesse e a brincadeira do seu cão.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 15,
    titulo: 'Brinquedo Interativo Dispensador de Petiscos para Cães',
    preco: 55.00,
    descricao: 'Brinquedo que dispensa petiscos conforme o cão interage, estimulando o raciocínio e o entretenimento.',
    imagem: 'https://images.unsplash.com/photo-1582234056230-05844431f4b8?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 16,
    titulo: 'Bolinha com Textura e Som para Cães',
    preco: 15.00,
    descricao: 'Bolinha com diferentes texturas e um som que atrai a atenção do cão, ideal para brincadeiras de buscar e mastigar.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 17,
    titulo: 'Tigela Interativa Anti-Gula para Cães',
    preco: 45.00,
    descricao: 'Tigela com divisórias que ajuda o cão a comer mais devagar, prevenindo engasgos e problemas digestivos.',
    imagem: 'https://images.unsplash.com/photo-1582234056230-05844431f4b8?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 18,
    titulo: 'Tapete Olfativo para Cães',
    preco: 69.90,
    descricao: 'Tapete com dobras e compartimentos para esconder petiscos, estimulando o faro e a mente do seu cão.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 19,
    titulo: 'Pelúcia Recheável para Gatos',
    preco: 25.00,
    descricao: 'Pelúcia divertida que pode ser recheada com catnip ou petiscos, proporcionando horas de diversão para seu gato.',
    imagem: 'https://images.unsplash.com/photo-1596854378873-1f1f1d1c8f1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 20,
    titulo: 'Brinquedo de Pena Giratório para Gatos',
    preco: 32.00,
    descricao: 'Brinquedo com penas que giram e se movem de forma imprevisível, estimulando o instinto de caça do seu felino.',
    imagem: 'https://images.unsplash.com/photo-1514888798-ef22822830b5?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 21,
    titulo: 'Pista de Bolinhas para Gatos',
    preco: 59.90,
    descricao: 'Pista com bolinhas que os gatos adoram perseguir, estimulando a agilidade e a brincadeira.',
    imagem: 'https://images.unsplash.com/photo-1549448834-f65590a7e0c4?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 22,
    titulo: 'Escova de Canto para Gatos',
    preco: 22.50,
    descricao: 'Escova que se fixa na parede, permitindo que o gato se esfregue e se coce, proporcionando um momento de relaxamento.',
    imagem: 'https://images.unsplash.com/photo-1590823521360-1e521e1a5e1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 23,
    titulo: 'Brinquedo de Pesca com Pena para Gatos',
    preco: 17.00,
    descricao: 'Varinha de pesca com penas na ponta, ideal para interagir com seu gato e simular a caça.',
    imagem: 'https://images.unsplash.com/photo-1596854378873-1f1f1d1c8f1e?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 24,
    titulo: 'Brinquedo de Sisal para Gatos',
    preco: 20.00,
    descricao: 'Brinquedo feito de sisal, um material natural que os gatos adoram arranhar, ajudando a proteger seus móveis.',
    imagem: 'https://images.unsplash.com/photo-1549448834-f65590a7e0c4?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 25,
    titulo: 'Brinquedo Sonoro para Gatos',
    preco: 14.00,
    descricao: 'Brinquedo que emite sons, atraindo a atenção do gato e estimulando a brincadeira.',
    imagem: 'https://images.unsplash.com/photo-1514888798-ef22822830b5?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 26,
    titulo: 'Escova de Dentes Mastigável para Cães',
    preco: 30.00,
    descricao: 'Brinquedo mastigável que ajuda a limpar os dentes do seu cão e massagear as gengivas.',
    imagem: 'https://images.unsplash.com/photo-1582234056230-05844431f4b8?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 27,
    titulo: 'Bolinha de Borracha Maciça para Cães',
    preco: 19.90,
    descricao: 'Bolinha de borracha maciça e resistente, ideal para cães com mordida forte e para brincadeiras de buscar.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 28,
    titulo: 'Osso de Nylon para Cães',
    preco: 42.00,
    descricao: 'Osso de nylon durável e seguro para o seu cão mastigar, ajudando a controlar a ansiedade e a manter a higiene bucal.',
    imagem: 'https://images.unsplash.com/photo-1563574971-80e9a5e8f4e2?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 29,
    titulo: 'Brinquedo de Encaixe para Petiscos de Cães',
    preco: 38.00,
    descricao: 'Brinquedo com cavidades onde você pode esconder petiscos, desafiando seu cão a descobrir como retirá-los.',
    imagem: 'https://images.unsplash.com/photo-1582234056230-05844431f4b8?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 30,
    titulo: 'Boia para Cães (Brinquedo Aquático)',
    preco: 50.00,
    descricao: 'Boia flutuante para cães, perfeita para brincadeiras na água e para incentivar o nado.',
    imagem: 'https://images.unsplash.com/photo-1548684711-64d1f2b5a6c3?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 31,
    titulo: 'Pneu de Borracha para Cães',
    preco: 27.00,
    descricao: 'Brinquedo em formato de pneu, feito de borracha resistente, ideal para mastigar e brincar de buscar.',
    imagem: 'https://images.unsplash.com/photo-1563574971-80e9a5e8f4e2?fit=crop&w=400&h=400&q=80'
  },
  {
    id: 32,
    titulo: 'Brinquedo com Compartimento Secreto para Cães',
    preco: 33.00,
    descricao: 'Brinquedo com um compartimento escondido para petiscos, que desafia o cão a encontrar o mecanismo de abertura.',
    imagem: 'https://images.unsplash.com/photo-1582234056230-05844431f4b8?fit=crop&w=400&h=400&q=80'
  }
];


  const [termoPesquisa, setTermoPesquisa] = useState('');

  const [ordenacao, setOrdenacao] = useState('nenhum');

  const produtosExibidos = useMemo(() => {
    let produtosFiltrados = todosOsProdutos.filter(produto =>
      produto.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

    switch (ordenacao) {
      case 'mais-barato':
        produtosFiltrados.sort((a, b) => a.preco - b.preco);
        break;
      case 'mais-caro':
        produtosFiltrados.sort((a, b) => b.preco - a.preco);
        break;
      default:
        break;
    }
    return produtosFiltrados;
  }, [todosOsProdutos, termoPesquisa, ordenacao]); 
   return (
    <div className="app-container">
      <section className="sectionprodutos">
        <h2 align="center" className="h2produtos">🐾 Nossos Produtos</h2>

    
        <div className="filtros-container">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            className="barra-pesquisa"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />

          <select
            className="dropdown-ordenacao"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            <option value="nenhum">Relevância (Padrão)</option>
            <option value="mais-barato">Preço: Do mais barato</option>
            <option value="mais-caro">Preço: Do mais caro</option>
          </select>
        </div>

        <div className="produtos-lista">
          {produtosExibidos.length > 0 ? (
            produtosExibidos.map(produto => (
              <Produto
                key={produto.id}
                titulo={produto.titulo}
                preco={produto.preco}
                descricao={produto.descricao}
                imagem={produto.imagem}
              />
            ))
          ) : (
            <p className="nenhum-produto-encontrado">Nenhum produto encontrado com a pesquisa ou filtros aplicados.</p>
          )}
        </div>
      </section>

      <section id="main">
        <div id="carrinho-container">
            <h3>Carrinho de Compras 🛒</h3>
            <ul id="lista-carrinho">

              <li>Exemplo de Item - R$ 10,00 <button className="remover-item">Remover</button></li>
              <li>Outro Item - R$ 25,50 <button className="remover-item">Remover</button></li>
            </ul>
            <p><strong>Total:</strong> R$ <span id="total-carrinho">35.50</span></p>
            <p>Mande o total no nosso WhatsApp, e qual o meio de pagamento!</p>
            <p>(11) 99999-9999</p>
        </div>
      </section>
    </div>
  );
};

export default Produtos;
