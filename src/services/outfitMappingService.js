import * as THREE from 'three';

class OutfitMappingService {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.materialCache = new Map();
    }

    /**
     * Creates a material from the generated outfit image
     * @param {string} imageUrl - URL or base64 of the generated outfit
     * @param {string} fabricType - Type of fabric for material properties
     * @returns {Promise<THREE.Material>}
     */
    async createOutfitMaterial(imageUrl, fabricType = 'Cotton') {
        const cacheKey = `${imageUrl}-${fabricType}`;

        if (this.materialCache.has(cacheKey)) {
            return this.materialCache.get(cacheKey);
        }

        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                imageUrl,
                (texture) => {
                    // Configure texture wrapping and filtering
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.anisotropy = 16;

                    // Create material based on fabric type
                    const material = this.createFabricMaterial(texture, fabricType);

                    this.materialCache.set(cacheKey, material);
                    resolve(material);
                },
                undefined,
                (error) => {
                    console.error('Error loading texture:', error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Creates appropriate material based on fabric type
     * @param {THREE.Texture} texture - The loaded texture
     * @param {string} fabricType - Type of fabric
     * @returns {THREE.Material}
     */
    createFabricMaterial(texture, fabricType) {
        const materialProperties = this.getFabricProperties(fabricType);

        const material = new THREE.MeshPhysicalMaterial({
            map: texture,
            roughness: materialProperties.roughness,
            metalness: materialProperties.metalness,
            clearcoat: materialProperties.clearcoat,
            clearcoatRoughness: materialProperties.clearcoatRoughness,
            sheen: materialProperties.sheen,
            sheenRoughness: materialProperties.sheenRoughness,
            sheenColor: new THREE.Color(materialProperties.sheenColor),
            side: THREE.DoubleSide,
            envMapIntensity: 1.5
        });

        return material;
    }

    /**
     * Get material properties based on fabric type
     * @param {string} fabricType - Type of fabric
     * @returns {Object} Material properties
     */
    getFabricProperties(fabricType) {
        const fabricProps = {
            'Cotton': {
                roughness: 0.8,
                metalness: 0,
                clearcoat: 0,
                clearcoatRoughness: 0,
                sheen: 0.3,
                sheenRoughness: 0.8,
                sheenColor: '#ffffff'
            },
            'Silk': {
                roughness: 0.2,
                metalness: 0,
                clearcoat: 0.3,
                clearcoatRoughness: 0.1,
                sheen: 1,
                sheenRoughness: 0.2,
                sheenColor: '#ffffff'
            },
            'Wool': {
                roughness: 0.9,
                metalness: 0,
                clearcoat: 0,
                clearcoatRoughness: 0,
                sheen: 0.5,
                sheenRoughness: 0.9,
                sheenColor: '#f0f0f0'
            },
            'Linen': {
                roughness: 0.7,
                metalness: 0,
                clearcoat: 0,
                clearcoatRoughness: 0,
                sheen: 0.2,
                sheenRoughness: 0.7,
                sheenColor: '#ffffff'
            },
            'Polyester': {
                roughness: 0.4,
                metalness: 0,
                clearcoat: 0.2,
                clearcoatRoughness: 0.3,
                sheen: 0.7,
                sheenRoughness: 0.4,
                sheenColor: '#ffffff'
            },
            'Leather': {
                roughness: 0.6,
                metalness: 0,
                clearcoat: 0.5,
                clearcoatRoughness: 0.2,
                sheen: 0.1,
                sheenRoughness: 0.6,
                sheenColor: '#000000'
            },
            'Denim': {
                roughness: 0.85,
                metalness: 0,
                clearcoat: 0,
                clearcoatRoughness: 0,
                sheen: 0.1,
                sheenRoughness: 0.85,
                sheenColor: '#4169e1'
            }
        };

        return fabricProps[fabricType] || fabricProps['Cotton'];
    }

    /**
     * Apply outfit to 3D model
     * @param {THREE.Object3D} model - The 3D model
     * @param {THREE.Material} material - The outfit material
     * @param {string} bodyPart - Which part to apply to (e.g., 'torso', 'full')
     */
    applyOutfitToModel(model, material, bodyPart = 'full') {
        model.traverse((child) => {
            if (child.isMesh) {
                // Apply material based on body part mapping
                if (this.shouldApplyToMesh(child.name, bodyPart)) {
                    child.material = material;
                    child.material.needsUpdate = true;
                }
            }
        });
    }

    /**
     * Determine if material should be applied to specific mesh
     * @param {string} meshName - Name of the mesh
     * @param {string} bodyPart - Target body part
     * @returns {boolean}
     */
    shouldApplyToMesh(meshName, bodyPart) {
        const bodyPartMappings = {
            'full': ['Body', 'Torso', 'Legs', 'Arms', 'Full'],
            'torso': ['Body', 'Torso', 'Chest', 'Upper'],
            'legs': ['Legs', 'Pants', 'Lower'],
            'dress': ['Body', 'Torso', 'Legs', 'Dress', 'Full']
        };

        const targetParts = bodyPartMappings[bodyPart] || bodyPartMappings['full'];
        return targetParts.some(part =>
            meshName.toLowerCase().includes(part.toLowerCase())
        );
    }

    /**
     * Create a preview material with adjustable properties
     * @param {string} imageUrl - URL of the outfit image
     * @param {Object} adjustments - Fitting adjustments
     * @returns {Promise<THREE.Material>}
     */
    async createPreviewMaterial(imageUrl, adjustments = {}) {
        const baseMaterial = await this.createOutfitMaterial(
            imageUrl,
            adjustments.fabric || 'Cotton'
        );

        // Apply adjustments
        if (adjustments.brightness) {
            baseMaterial.emissive = new THREE.Color(0xffffff);
            baseMaterial.emissiveIntensity = adjustments.brightness * 0.1;
        }

        if (adjustments.saturation) {
            // Implement saturation adjustment
            baseMaterial.userData.saturation = adjustments.saturation;
        }

        return baseMaterial;
    }

    /**
     * Clean up cached materials
     */
    dispose() {
        this.materialCache.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
        });
        this.materialCache.clear();
    }
}

export default new OutfitMappingService();
