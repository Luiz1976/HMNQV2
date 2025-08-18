// Script para testar se a imagem do manuscrito está sendo exibida corretamente
// Execute este script no console do navegador na página do manuscrito

console.log('🔍 Testando exibição da imagem do manuscrito...');

// 1. Verificar se a página carregou corretamente
const currentUrl = window.location.href;
console.log('📍 URL atual:', currentUrl);

// 2. Verificar se o componente ManuscriptViewer está presente
const manuscriptViewer = document.querySelector('[data-testid="manuscript-viewer"]') || 
                        document.querySelector('.manuscript-viewer') ||
                        document.querySelector('img[alt*="manuscrito"]') ||
                        document.querySelector('img[alt*="Manuscrito"]');

if (manuscriptViewer) {
    console.log('✅ Componente ManuscriptViewer encontrado:', manuscriptViewer);
} else {
    console.log('❌ Componente ManuscriptViewer NÃO encontrado');
    console.log('🔍 Procurando todas as imagens na página...');
    const allImages = document.querySelectorAll('img');
    console.log('📸 Total de imagens encontradas:', allImages.length);
    allImages.forEach((img, index) => {
        console.log(`Imagem ${index + 1}:`, {
            src: img.src,
            alt: img.alt,
            width: img.width,
            height: img.height,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
        });
    });
}

// 3. Verificar especificamente a imagem do manuscrito
const manuscriptImage = document.querySelector('img[src*="placeholder"]') ||
                       document.querySelector('img[src*="manuscrito"]') ||
                       document.querySelector('img[src*="Manuscrito"]');

if (manuscriptImage) {
    console.log('🖼️ Imagem do manuscrito encontrada!');
    console.log('📋 Detalhes da imagem:', {
        src: manuscriptImage.src,
        alt: manuscriptImage.alt,
        width: manuscriptImage.width,
        height: manuscriptImage.height,
        complete: manuscriptImage.complete,
        naturalWidth: manuscriptImage.naturalWidth,
        naturalHeight: manuscriptImage.naturalHeight,
        style: manuscriptImage.style.cssText,
        className: manuscriptImage.className
    });
    
    // Testar se a imagem carregou corretamente
    if (manuscriptImage.complete && manuscriptImage.naturalWidth > 0) {
        console.log('✅ Imagem carregada com sucesso!');
    } else {
        console.log('⚠️ Imagem pode não ter carregado completamente');
        
        // Adicionar listener para quando a imagem carregar
        manuscriptImage.onload = function() {
            console.log('✅ Imagem carregou após o teste!');
        };
        
        manuscriptImage.onerror = function() {
            console.log('❌ Erro ao carregar a imagem!');
        };
    }
} else {
    console.log('❌ Imagem do manuscrito NÃO encontrada');
}

// 4. Verificar se há erros de rede relacionados à imagem
const expectedImageUrl = 'https://via.placeholder.com/800x600/f0f0f0/333333?text=Manuscrito+de+Teste';
console.log('🌐 Testando acesso direto à URL da imagem:', expectedImageUrl);

fetch(expectedImageUrl)
    .then(response => {
        if (response.ok) {
            console.log('✅ URL da imagem acessível via fetch!');
            console.log('📊 Status:', response.status);
            console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
        } else {
            console.log('❌ Erro ao acessar URL da imagem via fetch:', response.status);
        }
    })
    .catch(error => {
        console.log('❌ Erro de rede ao testar URL da imagem:', error);
    });

// 5. Verificar se há elementos com erro de carregamento
const brokenImages = document.querySelectorAll('img[src=""], img:not([src])');
if (brokenImages.length > 0) {
    console.log('⚠️ Encontradas imagens com src vazio ou ausente:', brokenImages.length);
    brokenImages.forEach((img, index) => {
        console.log(`Imagem quebrada ${index + 1}:`, img);
    });
}

console.log('🏁 Teste de exibição da imagem concluído!');
console.log('💡 Se a imagem não estiver visível, verifique se você está na aba "Manuscrito" da página.');