import './style.css'; 
import * as THREE from 'three';
import gsap from 'gsap';

// 1. Configuração Básica do 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Dados dos Projetos (Caminhos das imagens corrigidos sem a barra inicial)
const projectsData = [
    {
        title: "FolhaFora!",
        desc: "Emissão ágil e automatizada de recibos e contracheques para prestadores fora da folha oficial, eliminando planilhas manuais.",
        stack: "React, Tailwind CSS, Supabase",
        link: "https://folha-fora.vercel.app",
        image: "folhafora.jpg" 
    },
    {
        title: "TributaCerto!",
        desc: "Sistema inteligente de gestão fiscal e BPO. Cruza CNPJ e NBS para mapear tributação, com download automático de XMLs.",
        stack: "React, Node.js, Supabase, Render",
        link: "https://tributa-certo.vercel.app",
        image: "tributacerto.jpg"
    },
    {
        title: "Radar Consil",
        desc: "Dashboard gerencial para monitoramento de rotinas contábeis, garantindo entregas no prazo e acompanhando a satisfação do cliente.",
        stack: "Power BI, JavaScript, Node.js",
        link: "https://radar.consilcontabilidade.com",
        image: "radar.jpg"
    },
    {
        title: "IgrejaHUB",
        desc: "Plataforma SaaS para comunidades. Gestão interna de escalas do ministério e portal público para engajamento dos membros.",
        stack: "React, Tailwind CSS, Firebase",
        link: "#",
        image: "igrejahub.jpg"
    }
];

// 3. Montando a Galeria 3D
const radius = 5;
const textureLoader = new THREE.TextureLoader();

for (let i = 0; i < projectsData.length; i++) {
    const angle = (i / projectsData.length) * Math.PI * 2; 
    
    const geometry = new THREE.PlaneGeometry(3.5, 2); 
    
    // Carrega a imagem e força o padrão de cor correto
    const texture = textureLoader.load(projectsData[i].image);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Adicionada a cor base branca (0xffffff) para evitar o fundo preto
    const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        color: 0xffffff,
        side: THREE.DoubleSide 
    });
    
    const plane = new THREE.Mesh(geometry, material);

    plane.position.x = Math.sin(angle) * radius;
    plane.position.z = Math.cos(angle) * radius;
    plane.lookAt(0, 0, 0);

    scene.add(plane);
}

// 4. Elementos da Interface (HTML)
const uiContainer = document.getElementById('ui-container');
const uiTitle = document.getElementById('project-title');
const uiDesc = document.getElementById('project-desc');
const uiStack = document.getElementById('project-stack');
const uiLink = document.getElementById('project-link');

// 5. Controle de Rotação (Scroll)
let currentRotation = 0;
let isAnimating = false;
let currentIndex = 0;

window.addEventListener('wheel', (event) => {
    if (isAnimating) return; 

    const direction = event.deltaY > 0 ? 1 : -1;
    currentRotation -= direction * (Math.PI / 2);

    // Lógica para saber qual projeto estamos olhando (0 a 3)
    currentIndex = (currentIndex + direction) % projectsData.length;
    if (currentIndex < 0) currentIndex += projectsData.length;

    isAnimating = true;
    
    // Anima o texto sumindo
    uiContainer.style.opacity = 0;

    // Anima a câmera girando
    gsap.to(camera.rotation, {
        y: currentRotation,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => { 
            // Atualiza os dados do HTML quando a câmera parar
            uiTitle.innerText = projectsData[currentIndex].title;
            uiDesc.innerText = projectsData[currentIndex].desc;
            uiStack.innerText = projectsData[currentIndex].stack;
            uiLink.href = projectsData[currentIndex].link;
            
            // Faz o texto novo aparecer
            uiContainer.style.opacity = 1;
            
            isAnimating = false; 
        }
    });
});

// 6. Loop do Three.js e Responsividade
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});