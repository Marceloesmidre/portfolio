import * as THREE from 'three';
import gsap from 'gsap';
import './style.css';

// 1. Configuração Básica (Cena, Câmera e Renderizador)
const scene = new THREE.Scene();

// Câmera no centro da "sala" (x: 0, y: 0, z: 0)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Criando os 4 Frames (A Galeria)
const radius = 5; // Distância dos quadros até o centro
const frames = [];
// Cores temporárias para representar: FolhaFora, TributaCerto, Radar Consil, IgrejaHUB
const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']; 

for (let i = 0; i < 4; i++) {
    // Calcula o ângulo em radianos para posicionar em um círculo perfeito
    const angle = (i / 4) * Math.PI * 2; 
    
    // Proporção do quadro (largura 3, altura 2)
    const geometry = new THREE.PlaneGeometry(3, 2); 
    const material = new THREE.MeshBasicMaterial({ 
        color: colors[i], 
        side: THREE.DoubleSide 
    });
    const plane = new THREE.Mesh(geometry, material);

    // Posiciona usando seno e cosseno para formar o círculo
    plane.position.x = Math.sin(angle) * radius;
    plane.position.z = Math.cos(angle) * radius;

    // Faz o quadro "olhar" diretamente para o centro da câmera
    plane.lookAt(0, 0, 0);

    scene.add(plane);
    frames.push(plane);
}

// Os dados dos seus projetos
const projectsData = [
    {
        title: "FolhaFora!",
        desc: "Emissão ágil e automatizada de recibos e contracheques para prestadores fora da folha oficial, eliminando planilhas manuais.",
        stack: "React, Tailwind CSS, Supabase",
        link: "https://folha-fora.vercel.app"
    },
    {
        title: "TributaCerto!",
        desc: "Sistema inteligente de gestão fiscal e BPO. Cruza CNPJ e NBS para mapear tributação, com download automático de XMLs.",
        stack: "React, Node.js, Supabase, Render",
        link: "https://tributa-certo.vercel.app"
    },
    {
        title: "Radar Consil",
        desc: "Dashboard gerencial para monitoramento de rotinas contábeis, garantindo entregas no prazo e acompanhando a satisfação do cliente.",
        stack: "Power BI, JavaScript, Node.js",
        link: "https://radar.consilcontabilidade.com"
    },
    {
        title: "IgrejaHUB",
        desc: "Plataforma SaaS para comunidades. Gestão interna de escalas do ministério e portal público para engajamento dos membros.",
        stack: "React, Tailwind CSS, Firebase",
        link: "#"
    }
];

// Selecionando os elementos do HTML
const uiContainer = document.getElementById('ui-container');
const uiTitle = document.getElementById('project-title');
const uiDesc = document.getElementById('project-desc');
const uiStack = document.getElementById('project-stack');
const uiLink = document.getElementById('project-link');

// 3. Controle de Rotação da Câmera (O Efeito Vitrine)
let currentRotation = 0;
let isAnimating = false;
let currentIndex = 0;

window.addEventListener('wheel', (event) => {
    if (isAnimating) return; 

    const direction = event.deltaY > 0 ? 1 : -1;
    currentRotation -= direction * (Math.PI / 2);

    // Lógica para saber qual projeto estamos olhando (0 a 3)
    currentIndex = (currentIndex + direction) % 4;
    if (currentIndex < 0) currentIndex += 4; // Corrige índice negativo

    isAnimating = true;
    
    // Apaga o texto atual suavemente
    uiContainer.style.opacity = 0;

    gsap.to(camera.rotation, {
        y: currentRotation,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => { 
            // Atualiza o texto com os dados do projeto atual
            uiTitle.innerText = projectsData[currentIndex].title;
            uiDesc.innerText = projectsData[currentIndex].desc;
            uiStack.innerText = projectsData[currentIndex].stack;
            uiLink.href = projectsData[currentIndex].link;
            
            // Mostra o texto novo
            uiContainer.style.opacity = 1;
            
            isAnimating = false; 
        }
    });
});