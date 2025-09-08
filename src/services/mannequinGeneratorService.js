import * as THREE from 'three';

class MannequinGeneratorService {
    constructor() {
        // Base models for 3D generation
        this.baseModels = {
            male: {
                small: { chest: 90, waist: 75, height: 165 },
                medium: { chest: 100, waist: 85, height: 175 },
                large: { chest: 110, waist: 95, height: 185 }
            },
            female: {
                small: { chest: 85, waist: 65, height: 160 },
                medium: { chest: 95, waist: 75, height: 170 },
                large: { chest: 105, waist: 85, height: 180 }
            }
        };

        // Pakistani brand size charts (measurements in cm)
        this.pakistaniBrandSizes = {
            male: {
                // Outfitters Men's Size Chart
                outfitters: {
                    small: { chest: '91-96', waist: '71-76', label: 'S' },
                    medium: { chest: '96-101', waist: '76-81', label: 'M' },
                    large: { chest: '101-106', waist: '81-86', label: 'L' },
                    xlarge: { chest: '106-111', waist: '86-91', label: 'XL' }
                },
                // Bonanza Satrangi Men's Size Chart
                bonanza: {
                    small: { chest: '94-99', waist: '74-79', label: '38' },
                    medium: { chest: '99-104', waist: '79-84', label: '40' },
                    large: { chest: '104-109', waist: '84-89', label: '42' },
                    xlarge: { chest: '109-114', waist: '89-94', label: '44' }
                },
                // Gul Ahmed Men's Size Chart
                gulAhmed: {
                    small: { chest: '92-97', waist: '72-77', label: 'S' },
                    medium: { chest: '97-102', waist: '77-82', label: 'M' },
                    large: { chest: '102-107', waist: '82-87', label: 'L' },
                    xlarge: { chest: '107-112', waist: '87-92', label: 'XL' }
                }
            },
            female: {
                // Khaadi Women's Size Chart
                khaadi: {
                    small: { chest: '81-86', waist: '61-66', hips: '86-91', label: 'S' },
                    medium: { chest: '86-91', waist: '66-71', hips: '91-96', label: 'M' },
                    large: { chest: '91-96', waist: '71-76', hips: '96-101', label: 'L' },
                    xlarge: { chest: '96-101', waist: '76-81', hips: '101-106', label: 'XL' }
                },
                // Sapphire Women's Size Chart
                sapphire: {
                    small: { chest: '84-89', waist: '64-69', hips: '89-94', label: 'S' },
                    medium: { chest: '89-94', waist: '69-74', hips: '94-99', label: 'M' },
                    large: { chest: '94-99', waist: '74-79', hips: '99-104', label: 'L' },
                    xlarge: { chest: '99-104', waist: '79-84', hips: '104-109', label: 'XL' }
                },
                // Gul Ahmed Women's Size Chart
                gulAhmed: {
                    small: { chest: '82-87', waist: '62-67', hips: '87-92', label: 'S' },
                    medium: { chest: '87-92', waist: '67-72', hips: '92-97', label: 'M' },
                    large: { chest: '92-97', waist: '72-77', hips: '97-102', label: 'L' },
                    xlarge: { chest: '97-102', waist: '77-82', hips: '102-107', label: 'XL' }
                }
            }
        };
    }

    // Generate a parametric 3D mannequin based on measurements
    generateParametricMannequin(measurements, gender = 'male') {
        const geometry = new THREE.BufferGeometry();

        // Create a simplified mannequin using basic shapes
        const mannequinGroup = new THREE.Group();

        // Scale factors based on measurements
        const heightScale = measurements.height / 175; // Normalize to average height
        const chestScale = measurements.chest / 100;
        const waistScale = measurements.waist / 85;

        // Head
        const headGeometry = new THREE.SphereGeometry(0.15 * heightScale, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.7 * heightScale;
        mannequinGroup.add(head);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.05 * heightScale, 0.05 * heightScale, 0.1 * heightScale);
        const neck = new THREE.Mesh(neckGeometry, headMaterial);
        neck.position.y = 1.55 * heightScale;
        mannequinGroup.add(neck);

        // Torso (using shape for more control)
        const torsoShape = new THREE.Shape();
        const torsoPoints = this.createTorsoShape(chestScale, waistScale, gender);
        torsoShape.setFromPoints(torsoPoints);

        const extrudeSettings = {
            steps: 2,
            depth: 0.3 * heightScale,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 8
        };

        const torsoGeometry = new THREE.ExtrudeGeometry(torsoShape, extrudeSettings);
        const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 1.0 * heightScale;
        torso.rotation.x = Math.PI / 2;
        mannequinGroup.add(torso);

        // Arms
        const armLength = measurements.armLength / 60;
        this.createArms(mannequinGroup, heightScale, armLength, torsoMaterial);

        // Legs
        this.createLegs(mannequinGroup, heightScale, torsoMaterial);

        return mannequinGroup;
    }

    createTorsoShape(chestScale, waistScale, gender) {
        const points = [];

        if (gender === 'female') {
            // Female torso shape with curves
            points.push(
                new THREE.Vector2(-0.15 * chestScale, 0.4),
                new THREE.Vector2(-0.18 * chestScale, 0.3),
                new THREE.Vector2(-0.2 * chestScale, 0.2),
                new THREE.Vector2(-0.18 * chestScale, 0.1),
                new THREE.Vector2(-0.15 * waistScale, 0),
                new THREE.Vector2(-0.13 * waistScale, -0.1),
                new THREE.Vector2(-0.15 * waistScale, -0.2),
                new THREE.Vector2(0, -0.25),
                new THREE.Vector2(0.15 * waistScale, -0.2),
                new THREE.Vector2(0.13 * waistScale, -0.1),
                new THREE.Vector2(0.15 * waistScale, 0),
                new THREE.Vector2(0.18 * chestScale, 0.1),
                new THREE.Vector2(0.2 * chestScale, 0.2),
                new THREE.Vector2(0.18 * chestScale, 0.3),
                new THREE.Vector2(0.15 * chestScale, 0.4),
                new THREE.Vector2(0, 0.45)
            );
        } else {
            // Male torso shape (more rectangular)
            points.push(
                new THREE.Vector2(-0.2 * chestScale, 0.4),
                new THREE.Vector2(-0.22 * chestScale, 0.2),
                new THREE.Vector2(-0.18 * waistScale, 0),
                new THREE.Vector2(-0.16 * waistScale, -0.2),
                new THREE.Vector2(0, -0.25),
                new THREE.Vector2(0.16 * waistScale, -0.2),
                new THREE.Vector2(0.18 * waistScale, 0),
                new THREE.Vector2(0.22 * chestScale, 0.2),
                new THREE.Vector2(0.2 * chestScale, 0.4),
                new THREE.Vector2(0, 0.45)
            );
        }

        return points;
    }

    createArms(group, heightScale, armLengthScale, material) {
        // Left arm
        const leftUpperArm = new THREE.CylinderGeometry(0.04 * heightScale, 0.04 * heightScale, 0.3 * armLengthScale);
        const leftUpperArmMesh = new THREE.Mesh(leftUpperArm, material);
        leftUpperArmMesh.position.set(-0.25 * heightScale, 1.3 * heightScale, 0);
        leftUpperArmMesh.rotation.z = Math.PI / 8;
        group.add(leftUpperArmMesh);

        const leftLowerArm = new THREE.CylinderGeometry(0.035 * heightScale, 0.035 * heightScale, 0.3 * armLengthScale);
        const leftLowerArmMesh = new THREE.Mesh(leftLowerArm, material);
        leftLowerArmMesh.position.set(-0.35 * heightScale, 1.05 * heightScale, 0);
        leftLowerArmMesh.rotation.z = Math.PI / 6;
        group.add(leftLowerArmMesh);

        // Right arm
        const rightUpperArm = new THREE.CylinderGeometry(0.04 * heightScale, 0.04 * heightScale, 0.3 * armLengthScale);
        const rightUpperArmMesh = new THREE.Mesh(rightUpperArm, material);
        rightUpperArmMesh.position.set(0.25 * heightScale, 1.3 * heightScale, 0);
        rightUpperArmMesh.rotation.z = -Math.PI / 8;
        group.add(rightUpperArmMesh);

        const rightLowerArm = new THREE.CylinderGeometry(0.035 * heightScale, 0.035 * heightScale, 0.3 * armLengthScale);
        const rightLowerArmMesh = new THREE.Mesh(rightLowerArm, material);
        rightLowerArmMesh.position.set(0.35 * heightScale, 1.05 * heightScale, 0);
        rightLowerArmMesh.rotation.z = -Math.PI / 6;
        group.add(rightLowerArmMesh);
    }

    createLegs(group, heightScale, material) {
        // Left leg
        const leftUpperLeg = new THREE.CylinderGeometry(0.06 * heightScale, 0.05 * heightScale, 0.4 * heightScale);
        const leftUpperLegMesh = new THREE.Mesh(leftUpperLeg, material);
        leftUpperLegMesh.position.set(-0.1 * heightScale, 0.45 * heightScale, 0);
        group.add(leftUpperLegMesh);

        const leftLowerLeg = new THREE.CylinderGeometry(0.05 * heightScale, 0.04 * heightScale, 0.4 * heightScale);
        const leftLowerLegMesh = new THREE.Mesh(leftLowerLeg, material);
        leftLowerLegMesh.position.set(-0.1 * heightScale, 0.05 * heightScale, 0);
        group.add(leftLowerLegMesh);

        // Right leg
        const rightUpperLeg = new THREE.CylinderGeometry(0.06 * heightScale, 0.05 * heightScale, 0.4 * heightScale);
        const rightUpperLegMesh = new THREE.Mesh(rightUpperLeg, material);
        rightUpperLegMesh.position.set(0.1 * heightScale, 0.45 * heightScale, 0);
        group.add(rightUpperLegMesh);

        const rightLowerLeg = new THREE.CylinderGeometry(0.05 * heightScale, 0.04 * heightScale, 0.4 * heightScale);
        const rightLowerLegMesh = new THREE.Mesh(rightLowerLeg, material);
        rightLowerLegMesh.position.set(0.1 * heightScale, 0.05 * heightScale, 0);
        group.add(rightLowerLegMesh);
    }

    // Find closest preset size based on measurements
    findClosestPreset(measurements, gender) {
        let closestSize = 'medium';
        let minDifference = Infinity;

        // Weight factors for different measurements (chest and waist are more important)
        const weights = {
            height: 0.3,
            chest: 0.4,
            waist: 0.3
        };

        Object.entries(this.baseModels[gender]).forEach(([size, preset]) => {
            // Calculate weighted difference
            const heightDiff = Math.abs(preset.height - measurements.height) * weights.height;
            const chestDiff = Math.abs(preset.chest - measurements.chest) * weights.chest;
            const waistDiff = Math.abs(preset.waist - measurements.waist) * weights.waist;

            const totalDifference = heightDiff + chestDiff + waistDiff;

            if (totalDifference < minDifference) {
                minDifference = totalDifference;
                closestSize = size;
            }
        });

        // Alternative logic based on primary measurements
        // If chest/waist measurements are significantly different from calculated closest
        if (gender === 'male') {
            if (measurements.chest < 95 && measurements.waist < 80) {
                closestSize = 'small';
            } else if (measurements.chest > 105 && measurements.waist > 90) {
                closestSize = 'large';
            }
        } else { // female
            if (measurements.chest < 90 && measurements.waist < 70) {
                closestSize = 'small';
            } else if (measurements.chest > 100 && measurements.waist > 80) {
                closestSize = 'large';
            }
        }

        return closestSize;
    }

    // Get Pakistani brand size recommendations
    getPakistaniBrandSizes(measurements, gender) {
        const brandRecommendations = {};
        const brands = this.pakistaniBrandSizes[gender];

        Object.entries(brands).forEach(([brandName, sizes]) => {
            let recommendedSize = null;
            let sizeLabel = '';

            // Check each size range
            Object.entries(sizes).forEach(([sizeName, sizeData]) => {
                const chestRange = sizeData.chest;
                const waistRange = sizeData.waist;

                // Parse range (e.g., "91-96" becomes [91, 96])
                const [chestMin, chestMax] = chestRange.split('-').map(Number);
                const [waistMin, waistMax] = waistRange.split('-').map(Number);

                // Check if measurements fall within this size range
                if (measurements.chest >= chestMin && measurements.chest <= chestMax &&
                    measurements.waist >= waistMin && measurements.waist <= waistMax) {
                    recommendedSize = sizeName;
                    sizeLabel = sizeData.label;
                }
            });

            // If no exact match, find closest
            if (!recommendedSize) {
                let minDiff = Infinity;
                Object.entries(sizes).forEach(([sizeName, sizeData]) => {
                    const chestRange = sizeData.chest;
                    const waistRange = sizeData.waist;

                    const [chestMin, chestMax] = chestRange.split('-').map(Number);
                    const [waistMin, waistMax] = waistRange.split('-').map(Number);

                    const chestMid = (chestMin + chestMax) / 2;
                    const waistMid = (waistMin + waistMax) / 2;

                    const diff = Math.abs(measurements.chest - chestMid) + Math.abs(measurements.waist - waistMid);

                    if (diff < minDiff) {
                        minDiff = diff;
                        recommendedSize = sizeName;
                        sizeLabel = sizeData.label;
                    }
                });
            }

            brandRecommendations[brandName] = {
                size: recommendedSize,
                label: sizeLabel
            };
        });

        return brandRecommendations;
    }

    // Get size chart for display
    getSizeChart(gender) {
        return this.pakistaniBrandSizes[gender];
    }

    // Export mannequin as GLB file
    async exportMannequin(mannequinGroup) {
        // This would require GLTFExporter from three/examples/jsm/exporters/GLTFExporter
        // For now, return the group
        return mannequinGroup;
    }

    // Create measurement visualization overlay
    createMeasurementOverlay(measurements) {
        const overlay = new THREE.Group();

        // Add measurement lines and labels
        // This would show chest, waist, height lines on the mannequin

        return overlay;
    }
}

export default new MannequinGeneratorService();