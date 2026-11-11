import * as THREE from "three";

/**
 * Transforms the existing 3D character into a polished, professional young Indian female college student:
 * - Long straight black hair with natural parting, side strands, and shoulder cascade
 * - Stylish modern black-framed eyeglasses with anti-reflective glass lenses
 * - Fair/light warm skin tone with subtle rosy blush and elegant lip tint
 * - Modern professional smart casual outfit (tailored blazer & top)
 * - Chic minimalist stud earrings
 *
 * All head accessories are parented directly to `spine006` (the head bone) so they
 * follow head movement, mouse tracking, breathing, and camera timelines perfectly!
 */
export function customizeFemaleCharacter(character: THREE.Object3D) {
  const headBone = character.getObjectByName("spine006") || character.getObjectByName("spine.006");

  // 1. Hide the old boy short hair mesh
  const oldHair = character.getObjectByName("hair");
  if (oldHair) {
    oldHair.visible = false;
  }

  // Common high-quality materials
  const hairMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0d0d10"),
    emissive: new THREE.Color("#050508"),
    roughness: 0.25,
    metalness: 0.15,
    clearcoat: 0.7,
    clearcoatRoughness: 0.15,
  });

  const skinColor = new THREE.Color("#F7D7C8");
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.42,
    metalness: 0.0,
  });

  const lipMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#C85E6E"),
    roughness: 0.32,
    metalness: 0.05,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
  });

  const blushMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#EFA2AB"),
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });

  const eyeglassFrameMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#111114"),
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 0.95,
    clearcoatRoughness: 0.1,
  });

  const glassLensMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#f1f5f9"),
    transparent: true,
    opacity: 0.85,
    transmission: 0.94,
    roughness: 0.04,
    ior: 1.52,
    reflectivity: 0.6,
  });

  const blazerMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1A2744"), // Deep navy suit — matches procedural lapels
    roughness: 0.65,
    metalness: 0.08,
  });

  const pantMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1A2744"), // Matching suit trousers
    roughness: 0.6,
    metalness: 0.1,
  });

  const shoeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#141417"), // Polished professional shoes
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.5,
  });

  const earringMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e2e8f0"), // Silver/pearl stud earrings
    roughness: 0.1,
    metalness: 0.9,
  });

  // 2. Restyle existing body meshes
  character.traverse((child: any) => {
    if (!child.isMesh) return;
    const name = child.name;
    const normalizedName = name.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Face, neck, ears, hands: Apply fair radiant skin tone
    if (name === "Plane.007" || name.includes("Plane.007") || name === "Neck" || name.includes("Ear") || name === "Hand") {
      child.material = skinMaterial;
    }
    // Body / Shirt: Apply tailored professional blazer
    else if (
      normalizedName === "BODYSHIRT" ||
      child.geometry?.name === "Cube.002"
    ) {
      child.material = blazerMaterial;
    }
    // Pants: Professional tailored slate trousers
    else if (name === "Pant" || name.includes("Pant")) {
      child.material = pantMaterial;
    }
    // Shoes & Soles
    else if (name.includes("Shoe") || name.includes("Sole")) {
      child.material = shoeMaterial;
    }
    // Eyebrows
    else if (name.includes("Eyebrow")) {
      child.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a1d"),
        roughness: 0.6,
      });
    }
  });

  const shirtMesh = character.getObjectByName("BODYSHIRT");
  if (shirtMesh instanceof THREE.Mesh) {
    shirtMesh.material = blazerMaterial;
    shirtMesh.material.needsUpdate = true;
  }

  // If head bone is present, add the female features
  if (headBone) {
    const femaleHeadGroup = new THREE.Group();
    femaleHeadGroup.name = "femaleFeaturesGroup";

    // ==========================================
    // A. LONG STRAIGHT BLACK HAIR SYSTEM
    // ==========================================
    const hairGroup = new THREE.Group();
    hairGroup.name = "femaleHairGroup";

    // 1. Crown / Top volume with center part
    const crownGeo = new THREE.SphereGeometry(1.22, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    crownGeo.scale(1.04, 0.96, 1.08);
    const crownMesh = new THREE.Mesh(crownGeo, hairMaterial);
    crownMesh.position.set(0, 1.48, -0.06);
    hairGroup.add(crownMesh);

    // 2. Back Hair Cascade (flows down over shoulders to mid-back)
    const backHairGeo = new THREE.CylinderGeometry(1.15, 1.35, 3.4, 28, 16, true, Math.PI * 0.65, Math.PI * 1.7);
    backHairGeo.scale(1.02, 1.0, 0.72);
    const backHairMesh = new THREE.Mesh(backHairGeo, hairMaterial);
    backHairMesh.position.set(0, 0.25, -0.42);
    backHairMesh.rotation.y = Math.PI * 0.15;
    hairGroup.add(backHairMesh);

    // Secondary back layer for extra thickness & natural volume
    const backHairLayer2 = new THREE.CylinderGeometry(1.18, 1.38, 3.2, 24, 8, true, Math.PI * 0.75, Math.PI * 1.5);
    backHairLayer2.scale(1.05, 1.0, 0.76);
    const backLayerMesh = new THREE.Mesh(backHairLayer2, hairMaterial);
    backLayerMesh.position.set(0, 0.2, -0.46);
    backLayerMesh.rotation.y = Math.PI * 0.15;
    hairGroup.add(backLayerMesh);

    // 3. Long Left & Right Tresses cascading down the front/sides
    // Left side tress
    const leftTressCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.02, 1.55, 0.15),
      new THREE.Vector3(1.12, 1.0, 0.38),
      new THREE.Vector3(1.06, 0.3, 0.52),
      new THREE.Vector3(0.96, -0.5, 0.58),
      new THREE.Vector3(0.85, -1.4, 0.62),
      new THREE.Vector3(0.78, -2.1, 0.62),
    ]);
    const leftTressGeo = new THREE.TubeGeometry(leftTressCurve, 32, 0.18, 12, false);
    const leftTressMesh = new THREE.Mesh(leftTressGeo, hairMaterial);
    hairGroup.add(leftTressMesh);

    // Additional outer left lock for fullness
    const leftTressCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.18, 1.45, 0.0),
      new THREE.Vector3(1.26, 0.8, 0.2),
      new THREE.Vector3(1.22, 0.1, 0.35),
      new THREE.Vector3(1.12, -0.7, 0.48),
      new THREE.Vector3(0.98, -1.6, 0.54),
      new THREE.Vector3(0.88, -2.2, 0.55),
    ]);
    const leftTressMesh2 = new THREE.Mesh(new THREE.TubeGeometry(leftTressCurve2, 32, 0.15, 12, false), hairMaterial);
    hairGroup.add(leftTressMesh2);

    // Right side tress
    const rightTressCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.02, 1.55, 0.15),
      new THREE.Vector3(-1.12, 1.0, 0.38),
      new THREE.Vector3(-1.06, 0.3, 0.52),
      new THREE.Vector3(-0.96, -0.5, 0.58),
      new THREE.Vector3(-0.85, -1.4, 0.62),
      new THREE.Vector3(-0.78, -2.1, 0.62),
    ]);
    const rightTressGeo = new THREE.TubeGeometry(rightTressCurve, 32, 0.18, 12, false);
    const rightTressMesh = new THREE.Mesh(rightTressGeo, hairMaterial);
    hairGroup.add(rightTressMesh);

    // Additional outer right lock for fullness
    const rightTressCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.18, 1.45, 0.0),
      new THREE.Vector3(-1.26, 0.8, 0.2),
      new THREE.Vector3(-1.22, 0.1, 0.35),
      new THREE.Vector3(-1.12, -0.7, 0.48),
      new THREE.Vector3(-0.98, -1.6, 0.54),
      new THREE.Vector3(-0.88, -2.2, 0.55),
    ]);
    const rightTressMesh2 = new THREE.Mesh(new THREE.TubeGeometry(rightTressCurve2, 32, 0.15, 12, false), hairMaterial);
    hairGroup.add(rightTressMesh2);

    // 4. Face-Framing Front Strands (softening cheekbones)
    const leftFaceStrandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.72, 1.62, 0.82),
      new THREE.Vector3(0.82, 1.15, 0.96),
      new THREE.Vector3(0.78, 0.65, 0.98),
      new THREE.Vector3(0.72, 0.2, 0.92),
    ]);
    const leftFaceStrand = new THREE.Mesh(new THREE.TubeGeometry(leftFaceStrandCurve, 20, 0.07, 8, false), hairMaterial);
    hairGroup.add(leftFaceStrand);

    const rightFaceStrandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, 1.62, 0.82),
      new THREE.Vector3(-0.82, 1.15, 0.96),
      new THREE.Vector3(-0.78, 0.65, 0.98),
      new THREE.Vector3(-0.72, 0.2, 0.92),
    ]);
    const rightFaceStrand = new THREE.Mesh(new THREE.TubeGeometry(rightFaceStrandCurve, 20, 0.07, 8, false), hairMaterial);
    hairGroup.add(rightFaceStrand);

    // 5. Elegant Soft Parted Bangs / Front Sweep (above glasses)
    const leftBangCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 1.88, 0.94),
      new THREE.Vector3(0.38, 1.76, 1.04),
      new THREE.Vector3(0.75, 1.58, 0.98),
    ]);
    const leftBang = new THREE.Mesh(new THREE.TubeGeometry(leftBangCurve, 16, 0.09, 8, false), hairMaterial);
    hairGroup.add(leftBang);

    const rightBangCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 1.88, 0.94),
      new THREE.Vector3(-0.42, 1.74, 1.04),
      new THREE.Vector3(-0.76, 1.56, 0.98),
    ]);
    const rightBang = new THREE.Mesh(new THREE.TubeGeometry(rightBangCurve, 16, 0.09, 8, false), hairMaterial);
    hairGroup.add(rightBang);

    femaleHeadGroup.add(hairGroup);

    // ==========================================
    // B. STYLISH BLACK-FRAMED EYEGLASSES
    // ==========================================
    const glassesGroup = new THREE.Group();
    glassesGroup.name = "femaleGlassesGroup";
    glassesGroup.position.set(0, 1.28, 1.02);

    const rimWidth = 0.52;
    const rimHeight = 0.36;
    const rimRadius = 0.035;

    // Helper function to create stylish rounded rectangular frame
    const createRim = (xPos: number) => {
      const shape = new THREE.Shape();
      const x = -rimWidth / 2;
      const y = -rimHeight / 2;
      const w = rimWidth;
      const h = rimHeight;
      const r = 0.12; // corner radius

      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      // Inner hole
      const hole = new THREE.Path();
      const hw = rimWidth - 0.07;
      const hh = rimHeight - 0.07;
      const hx = -hw / 2;
      const hy = -hh / 2;
      const hr = 0.09;

      hole.moveTo(hx + hr, hy);
      hole.lineTo(hx + hw - hr, hy);
      hole.quadraticCurveTo(hx + hw, hy, hx + hw, hy + hr);
      hole.lineTo(hx + hw, hy + hh - hr);
      hole.quadraticCurveTo(hx + hw, hy + hh, hx + hw - hr, hy + hh);
      hole.lineTo(hx + hr, hy + hh);
      hole.quadraticCurveTo(hx, hy + hh, hx, hy + hh - hr);
      hole.lineTo(hx, hy + hr);
      hole.quadraticCurveTo(hx, hy, hx + hr, hy);
      shape.holes.push(hole);

      const extrudeSettings = {
        depth: 0.05,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      };

      const rimGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const rimMesh = new THREE.Mesh(rimGeo, eyeglassFrameMaterial);
      rimMesh.position.set(xPos, 0, 0);

      // Glass Lens inside the frame
      const lensGeo = new THREE.PlaneGeometry(hw * 0.98, hh * 0.98);
      const lensMesh = new THREE.Mesh(lensGeo, glassLensMaterial);
      lensMesh.position.set(xPos, 0, 0.025);

      const group = new THREE.Group();
      group.add(rimMesh);
      group.add(lensMesh);
      return group;
    };

    // Left and Right eye rims
    glassesGroup.add(createRim(0.44));
    glassesGroup.add(createRim(-0.44));

    // Nose Bridge
    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, 0.02, 0.01),
      new THREE.Vector3(0, 0.06, 0.03),
      new THREE.Vector3(0.18, 0.02, 0.01),
    ]);
    const bridgeMesh = new THREE.Mesh(
      new THREE.TubeGeometry(bridgeCurve, 12, rimRadius * 0.8, 8, false),
      eyeglassFrameMaterial
    );
    glassesGroup.add(bridgeMesh);

    // Left & Right Temples (arms extending back toward ears)
    const leftTempleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.70, 0.02, 0.0),
      new THREE.Vector3(0.95, -0.01, -0.45),
      new THREE.Vector3(1.18, -0.05, -0.85),
    ]);
    const leftTemple = new THREE.Mesh(
      new THREE.TubeGeometry(leftTempleCurve, 16, 0.02, 8, false),
      eyeglassFrameMaterial
    );
    glassesGroup.add(leftTemple);

    const rightTempleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.70, 0.02, 0.0),
      new THREE.Vector3(-0.95, -0.01, -0.45),
      new THREE.Vector3(-1.18, -0.05, -0.85),
    ]);
    const rightTemple = new THREE.Mesh(
      new THREE.TubeGeometry(rightTempleCurve, 16, 0.02, 8, false),
      eyeglassFrameMaterial
    );
    glassesGroup.add(rightTemple);

    femaleHeadGroup.add(glassesGroup);

    // ==========================================
    // C. FEMININE FACIAL FEATURES & TOUCHES
    // ==========================================
    // 1. Rosy Cheek Blush
    const blushGeo = new THREE.CircleGeometry(0.24, 20);
    const leftBlush = new THREE.Mesh(blushGeo, blushMaterial);
    leftBlush.position.set(0.55, 1.05, 1.03);
    leftBlush.rotation.y = 0.28;
    leftBlush.rotation.x = -0.12;
    femaleHeadGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMaterial);
    rightBlush.position.set(-0.55, 1.05, 1.03);
    rightBlush.rotation.y = -0.28;
    rightBlush.rotation.x = -0.12;
    femaleHeadGroup.add(rightBlush);

    // 2. Soft Rosy Smile Lip Overlay
    const lipCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.77, 1.04),
      new THREE.Vector3(-0.1, 0.76, 1.07),
      new THREE.Vector3(0, 0.765, 1.08),
      new THREE.Vector3(0.1, 0.76, 1.07),
      new THREE.Vector3(0.25, 0.77, 1.04),
    ]);
    const lipMesh = new THREE.Mesh(
      new THREE.TubeGeometry(lipCurve, 16, 0.038, 8, false),
      lipMaterial
    );
    femaleHeadGroup.add(lipMesh);

    // 3. Delicate Dark Eyelash Accents
    const lashMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#111115") });
    const leftLashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, 1.34, 1.02),
      new THREE.Vector3(0.44, 1.37, 1.04),
      new THREE.Vector3(0.66, 1.34, 1.0),
    ]);
    femaleHeadGroup.add(new THREE.Mesh(new THREE.TubeGeometry(leftLashCurve, 12, 0.02, 6, false), lashMaterial));

    const rightLashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 1.34, 1.02),
      new THREE.Vector3(-0.44, 1.37, 1.04),
      new THREE.Vector3(-0.66, 1.34, 1.0),
    ]);
    femaleHeadGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rightLashCurve, 12, 0.02, 6, false), lashMaterial));

    // 4. Elegant Minimalist Stud Earrings (Left & Right)
    const studGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const leftEarring = new THREE.Mesh(studGeo, earringMaterial);
    leftEarring.position.set(1.42, 1.15, 0.08);
    femaleHeadGroup.add(leftEarring);

    const rightEarring = new THREE.Mesh(studGeo, earringMaterial);
    rightEarring.position.set(-1.42, 1.15, 0.08);
    femaleHeadGroup.add(rightEarring);

    // ==========================================
    // D. PROFESSIONAL SUIT — WIDE LAPELS, SHIRT COLLAR, TIE & BUTTONS
    // ==========================================
    const suitGroup = new THREE.Group();
    suitGroup.name = "suitGroup";

    const lapelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1A2744"),   // Deep navy suit fabric
      roughness: 0.68,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
    const shirtMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F5F7FA"),   // Crisp white dress shirt
      roughness: 0.52,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const tieMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#8B1A2C"),   // Deep burgundy silk tie
      roughness: 0.38,
      metalness: 0.06,
      clearcoat: 0.35,
      side: THREE.DoubleSide,
    });
    const buttonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#C8D0DC"),
      roughness: 0.3,
      metalness: 0.7,
    });

    // Helper: flat quadrilateral as 2 triangles
    const makeQuad = (
      v0: THREE.Vector3, v1: THREE.Vector3,
      v2: THREE.Vector3, v3: THREE.Vector3,
      mat: THREE.Material
    ) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array([
        v0.x, v0.y, v0.z,
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v0.x, v0.y, v0.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z,
      ]);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, mat);
    };

    // --- White Dress Shirt Panel (V-neck area) ---
    // A broad white triangle showing between the lapels
    const shirtPanel = makeQuad(
      new THREE.Vector3(-0.32, -0.15, 0.56),
      new THREE.Vector3( 0.32, -0.15, 0.56),
      new THREE.Vector3( 0.10, -1.90, 0.70),
      new THREE.Vector3(-0.10, -1.90, 0.70),
      shirtMat
    );
    suitGroup.add(shirtPanel);

    // --- Shirt Collar — two stiff collar points ---
    // Left collar point
    const leftCollar = makeQuad(
      new THREE.Vector3( 0.05, -0.05, 0.57),
      new THREE.Vector3( 0.44,  0.00, 0.60),
      new THREE.Vector3( 0.36, -0.38, 0.62),
      new THREE.Vector3( 0.05, -0.30, 0.59),
      shirtMat
    );
    suitGroup.add(leftCollar);
    // Right collar point
    const rightCollar = makeQuad(
      new THREE.Vector3(-0.05, -0.05, 0.57),
      new THREE.Vector3(-0.44,  0.00, 0.60),
      new THREE.Vector3(-0.36, -0.38, 0.62),
      new THREE.Vector3(-0.05, -0.30, 0.59),
      shirtMat
    );
    suitGroup.add(rightCollar);

    // --- Left Lapel (wide, flat, notched) ---
    // Upper notch triangle
    const leftLapelTop = makeQuad(
      new THREE.Vector3( 0.44,  0.00, 0.60),
      new THREE.Vector3( 0.90,  0.12, 0.60),
      new THREE.Vector3( 0.90, -0.50, 0.63),
      new THREE.Vector3( 0.36, -0.38, 0.62),
      lapelMat
    );
    suitGroup.add(leftLapelTop);
    // Lower lapel panel
    const leftLapelBottom = makeQuad(
      new THREE.Vector3( 0.90, -0.50, 0.63),
      new THREE.Vector3( 1.10, -1.10, 0.66),
      new THREE.Vector3( 0.55, -1.95, 0.70),
      new THREE.Vector3( 0.30, -1.00, 0.67),
      lapelMat
    );
    suitGroup.add(leftLapelBottom);

    // --- Right Lapel ---
    const rightLapelTop = makeQuad(
      new THREE.Vector3(-0.44,  0.00, 0.60),
      new THREE.Vector3(-0.90,  0.12, 0.60),
      new THREE.Vector3(-0.90, -0.50, 0.63),
      new THREE.Vector3(-0.36, -0.38, 0.62),
      lapelMat
    );
    suitGroup.add(rightLapelTop);
    const rightLapelBottom = makeQuad(
      new THREE.Vector3(-0.90, -0.50, 0.63),
      new THREE.Vector3(-1.10, -1.10, 0.66),
      new THREE.Vector3(-0.55, -1.95, 0.70),
      new THREE.Vector3(-0.30, -1.00, 0.67),
      lapelMat
    );
    suitGroup.add(rightLapelBottom);

    // --- Slim Tie ---
    const tiePanel = makeQuad(
      new THREE.Vector3(-0.065, -0.30, 0.595),
      new THREE.Vector3( 0.065, -0.30, 0.595),
      new THREE.Vector3( 0.045, -1.75, 0.695),
      new THREE.Vector3(-0.045, -1.75, 0.695),
      tieMat
    );
    suitGroup.add(tiePanel);
    // Tie knot (small box at collar)
    const tieKnotGeo = new THREE.BoxGeometry(0.11, 0.09, 0.055);
    const tieKnot = new THREE.Mesh(tieKnotGeo, tieMat);
    tieKnot.position.set(0, -0.265, 0.60);
    suitGroup.add(tieKnot);

    // --- Suit Buttons (4 down front) ---
    const btnGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const btnYPositions = [-0.42, -0.80, -1.18, -1.56];
    btnYPositions.forEach((y) => {
      const btn = new THREE.Mesh(btnGeo, buttonMat);
      btn.position.set(0, y, 0.700);
      suitGroup.add(btn);
    });

    // --- Pocket Square on left chest ---
    const pocketSquare = makeQuad(
      new THREE.Vector3(0.72, -0.58, 0.635),
      new THREE.Vector3(0.95, -0.55, 0.640),
      new THREE.Vector3(0.97, -0.42, 0.638),
      new THREE.Vector3(0.74, -0.44, 0.633),
      new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#FFFFFF"), roughness: 0.5, side: THREE.DoubleSide })
    );
    suitGroup.add(pocketSquare);

    // Attach suit group to the torso bone (spine003/004) so it moves with body
    const torsoBone =
      character.getObjectByName("spine.003") ||
      character.getObjectByName("spine003") ||
      character.getObjectByName("spine.004") ||
      character.getObjectByName("spine004");

    if (torsoBone) {
      character.updateMatrixWorld(true);
      // Express suit group in torso bone's local space
      const worldToTorso = new THREE.Matrix4().copy(torsoBone.matrixWorld).invert();
      suitGroup.applyMatrix4(worldToTorso);
      torsoBone.add(suitGroup);
    } else {
      // Fallback: add directly to headBone (will still look ok)
      femaleHeadGroup.add(suitGroup);
    }

    // Finally add the whole head group to headBone
    headBone.add(femaleHeadGroup);
  }

  return character;
}
