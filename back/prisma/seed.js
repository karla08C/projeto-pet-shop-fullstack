// prisma/seed.js

import { PrismaClient } from '@prisma/client';
// 💡 CORREÇÃO 1: Importa o default export e o renomeia como 'produtosData'
import produtosData from '../../front/src/data/produtosData.js'; 
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando o povoamento (seeding) dos produtos...');

    // 🚨 ASSUMIMOS que o vendedor com ID 1 já existe
    const vendedorIdPadrao = 1; 

    // --- Povoar Produtos ---
    for (const produto of produtosData) {
        try {
            // Conversão de tipos
            const precoDecimal = new Decimal(produto.preco);
            const estoquePadrao = 20;

            // 🚨 ATENÇÃO: Seu JSON tem IDs duplicados (ex: 64). O Prisma vai falhar.
            // Usamos createMany ou upsert se houver IDs duplicados, mas aqui usamos create:
            await prisma.produto.create({
                data: {
                    // Mapeamento dos campos do seu JSON para o seu modelo Produto
                    // Seu JSON usa 'titulo', o DB usa 'nome'
                    nome: produto.titulo, 
                    descricao: produto.descricao || 'Produto de alta qualidade.',
                    preco: precoDecimal,
                    estoque: estoquePadrao,
                    vendedor_id: vendedorIdPadrao,
                    categoria: produto.categoria || 'Outros',
                    // Seu JSON usa 'imagem', o DB usa 'imagem_url'
                    imagem_url: produto.imagem || null, 
                    ativo: true,
                },
            });
            console.log(`✅ Produto criado: ${produto.titulo}`);

        } catch (error) {
            console.error(`❌ Erro ao criar produto '${produto.titulo}':`, error.message);
            // Isso ajuda a debuggar se houver um ID duplicado ou um erro de chave estrangeira
        }
    }
    console.log('Povoamento de produtos concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro fatal no seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });