/**
 * useKnowledgeGraph — Three.js scene setup + animation loop.
 *
 * Renders a 3D knowledge graph of Abdul's technical domains. The graph
 * auto-rotates slowly, supports mouse drag to re-orient, and exposes
 * hover state for the Vue component to drive an HTML label overlay.
 *
 * Lifecycle: the composable returns a `mount` function the component
 * calls in onMounted with its canvas element. `dispose` cleans up.
 *
 * Reduced motion: when prefers-reduced-motion is set, auto-rotation
 * is disabled but manual drag still works.
 */
import * as THREE from 'three';
export const DOMAIN_NODES = [
    {
        id: 'backend',
        label: 'Backend AI',
        position: [0, 0, 0],
        neighbors: [
            { id: 'llm', weight: 1.0 },
            { id: 'multi-agent', weight: 0.9 },
            { id: 'rag', weight: 0.8 },
            { id: 'azure', weight: 0.9 },
        ],
        anchor: '#experience',
    },
    {
        id: 'llm',
        label: 'LLMs',
        position: [-3.2, 1.4, -0.8],
        neighbors: [
            { id: 'backend', weight: 1.0 },
            { id: 'multi-agent', weight: 0.7 },
            { id: 'research', weight: 0.8 },
        ],
        anchor: '#experience',
    },
    {
        id: 'multi-agent',
        label: 'Multi-agent systems',
        position: [3.2, 1.6, -0.4],
        neighbors: [
            { id: 'backend', weight: 0.9 },
            { id: 'llm', weight: 0.7 },
            { id: 'rag', weight: 0.6 },
            { id: 'research', weight: 0.6 },
        ],
        anchor: '#projects',
    },
    {
        id: 'rag',
        label: 'Multi-tenant RAG',
        position: [2.4, -2.0, 1.6],
        neighbors: [
            { id: 'backend', weight: 0.8 },
            { id: 'multi-agent', weight: 0.6 },
        ],
        anchor: '#experience',
    },
    {
        id: 'azure',
        label: 'Azure cloud',
        position: [-2.4, -1.6, 1.4],
        neighbors: [{ id: 'backend', weight: 0.9 }],
        anchor: '#skills',
    },
    {
        id: 'research',
        label: 'Causal reasoning',
        position: [0.4, 2.8, 1.0],
        neighbors: [
            { id: 'llm', weight: 0.8 },
            { id: 'multi-agent', weight: 0.6 },
        ],
        anchor: '#projects',
    },
];
/* ── Composable ────────────────────────────────────────── */
export function useKnowledgeGraph() {
    let cleanup = null;
    /**
     * Mount the Three.js scene into the given canvas.
     * @param canvas  HTMLCanvasElement to render into
     * @param callbacks  hover + click handlers driven by the parent component
     */
    function mount(canvas, callbacks) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        /* ── Scene / camera / renderer ─────────────────────── */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 12);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        renderer.setClearColor(0x000000, 0);
        /* ── Lights (very subtle, the materials are mostly emissive) ── */
        scene.add(new THREE.AmbientLight(0xfaf9f6, 0.6));
        const key = new THREE.DirectionalLight(0xffffff, 0.4);
        key.position.set(4, 6, 8);
        scene.add(key);
        /* ── Nodes ─────────────────────────────────────────── */
        // Accent colour from theme: deep brick red. Use HSL for a Three.js color.
        const accent = new THREE.Color('#9f1f1f');
        const accentHot = new THREE.Color('#c43d3d');
        const fg = new THREE.Color('#2a2a2a');
        const sphereGeo = new THREE.SphereGeometry(0.45, 32, 32);
        const hubSphereGeo = new THREE.SphereGeometry(0.65, 32, 32);
        const nodeMeshes = new Map();
        const nodeMeta = new Map();
        DOMAIN_NODES.forEach((node) => {
            const isHub = node.id === 'backend';
            const mat = new THREE.MeshStandardMaterial({
                color: isHub ? accent : fg,
                emissive: isHub ? accentHot : accent,
                emissiveIntensity: isHub ? 0.7 : 0.3,
                metalness: 0.05,
                roughness: 0.45,
            });
            const mesh = new THREE.Mesh(isHub ? hubSphereGeo : sphereGeo, mat);
            mesh.position.set(...node.position);
            mesh.userData.nodeId = node.id;
            scene.add(mesh);
            nodeMeshes.set(node.id, mesh);
            nodeMeta.set(node.id, node);
        });
        /* ── Edges ─────────────────────────────────────────── */
        const linePositions = [];
        DOMAIN_NODES.forEach((node) => {
            node.neighbors.forEach((neighbor) => {
                if (neighbor.id <= node.id)
                    return; // dedupe
                const a = node.position;
                const b = nodeMeta.get(neighbor.id).position;
                linePositions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
            });
        });
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x9f1f1f,
            transparent: true,
            opacity: 0.35,
        });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);
        /* ── Particle field (subtle ambient depth) ─────────── */
        const particleCount = 220;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const r = 8 + Math.random() * 14;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            particlePositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
            particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            particlePositions[i * 3 + 2] = r * Math.cos(phi);
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x9f1f1f,
            size: 0.02,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        /* ── Interaction: drag to rotate, raycast for hover ── */
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        const sceneRotation = { x: 0.1, y: 0 };
        let velocity = { x: 0, y: 0 };
        const onPointerDown = (e) => {
            isDragging = true;
            dragStart = { x: e.clientX, y: e.clientY };
            velocity = { x: 0, y: 0 };
            canvas.setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e) => {
            if (isDragging) {
                const dx = e.clientX - dragStart.x;
                const dy = e.clientY - dragStart.y;
                sceneRotation.y += dx * 0.005;
                sceneRotation.x += dy * 0.003;
                sceneRotation.x = Math.max(-1, Math.min(1, sceneRotation.x));
                velocity = { x: dx * 0.0005, y: dy * 0.0005 };
                dragStart = { x: e.clientX, y: e.clientY };
                return;
            }
            // Hover raycaster
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };
        const onPointerUp = (e) => {
            if (isDragging && Math.abs(velocity.x) + Math.abs(velocity.y) < 0.001) {
                // It was a click, not a drag — raycaster will handle it
            }
            isDragging = false;
            try {
                canvas.releasePointerCapture(e.pointerId);
            }
            catch { /* noop */ }
        };
        const onWheel = (e) => {
            e.preventDefault();
            const factor = 1 + e.deltaY * 0.001;
            camera.position.multiplyScalar(factor);
            camera.position.clampLength(6, 22);
        };
        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerup', onPointerUp);
        canvas.addEventListener('pointerleave', onPointerUp);
        canvas.addEventListener('wheel', onWheel, { passive: false });
        /* ── Raycaster ─────────────────────────────────────── */
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(-2, -2); // off-screen until first move
        let hoveredId = null;
        /* ── Animation loop ─────────────────────────────────── */
        let rafId = 0;
        const clock = new THREE.Clock();
        const tick = () => {
            const dt = clock.getDelta();
            // Auto-rotation (off if reduced motion)
            if (!reducedMotion && !isDragging) {
                sceneRotation.y += dt * 0.08;
                // Decay user-applied velocity
                velocity.x *= 0.94;
                velocity.y *= 0.94;
                sceneRotation.y += velocity.x;
                sceneRotation.x += velocity.y;
                sceneRotation.x = Math.max(-1, Math.min(1, sceneRotation.x));
            }
            scene.rotation.x = sceneRotation.x;
            scene.rotation.y = sceneRotation.y;
            particles.rotation.y += dt * 0.02;
            // Hover raycaster (only when not dragging)
            if (!isDragging) {
                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(Array.from(nodeMeshes.values()));
                const newId = intersects.length > 0 ? (intersersectNodeId(intersects[0])) : null;
                if (newId !== hoveredId) {
                    hoveredId = newId;
                    callbacks.onHover(newId);
                    // Visual emphasis on hover
                    nodeMeshes.forEach((mesh, id) => {
                        const mat = mesh.material;
                        mat.emissiveIntensity = id === newId ? 0.9 : (id === 'backend' ? 0.7 : 0.3);
                    });
                }
            }
            // Click handler: pointer state at last pointerdown vs pointerup
            // (delegated via window listener)
            renderer.render(scene, camera);
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        function intersersectNodeId(intersection) {
            return intersection.object.userData.nodeId;
        }
        const onClick = (e) => {
            if (isDragging)
                return;
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(Array.from(nodeMeshes.values()));
            if (intersects.length > 0) {
                const id = intersects[0].object.userData.nodeId;
                callbacks.onClick(id);
            }
        };
        canvas.addEventListener('click', onClick);
        /* ── Resize observer ────────────────────────────────── */
        const resize = () => {
            const { clientWidth, clientHeight } = canvas;
            if (clientWidth === 0 || clientHeight === 0)
                return;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight, false);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        /* ── Cleanup ────────────────────────────────────────── */
        cleanup = () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            canvas.removeEventListener('pointerdown', onPointerDown);
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerup', onPointerUp);
            canvas.removeEventListener('pointerleave', onPointerUp);
            canvas.removeEventListener('wheel', onWheel);
            canvas.removeEventListener('click', onClick);
            sphereGeo.dispose();
            hubSphereGeo.dispose();
            lineGeo.dispose();
            lineMat.dispose();
            particleGeo.dispose();
            particleMat.dispose();
            nodeMeshes.forEach((mesh) => {
                mesh.material.dispose();
            });
            renderer.dispose();
        };
    }
    function dispose() {
        if (cleanup) {
            cleanup();
            cleanup = null;
        }
    }
    function findNode(id) {
        return DOMAIN_NODES.find((n) => n.id === id);
    }
    return { mount, dispose, findNode };
}
