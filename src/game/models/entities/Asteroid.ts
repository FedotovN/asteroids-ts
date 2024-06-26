import Agent, { AgentProperties } from "../Agent";
import Vector from "@/engine/models/Vector";
import PolygonShape from "@/engine/models/Shape/PolygonShape";
import Rigidbody from "@/engine/models/components/Rigidbody";
import Collider from "@/engine/models/components/Collider";
import AudioService from "@/engine/services/AudioService";
import Player from "@/game/models/entities/Player";
import MeshRenderer from "@/engine/models/components/MeshRenderer";
import PolygonMesh from "@/engine/models/Mesh/PolygonMesh";
import Mesh from "@/engine/models/Mesh/Mesh";

export default class Asteroid extends Agent {
    private _isBlinking: boolean;
    private _maxRadius = 70;
    private _minRadius = 50;
    private _asteroidDefaultColor = 'rgb(23, 86, 118)'
    public player: Player;
    radius: number;
    constructor(props: AgentProperties & { player: Player }) {
        super(props);

        this.name = 'asteroid';
        this.player = props.player;

        this.radius = ((this._maxRadius - this._minRadius) * Math.random()) + this._minRadius;
        const difference = this.radius / 2;
        const vertexAmount = Math.floor(Math.random() * 5) + 5;
        const vertexArr = [];

        for (let i = 0; i < vertexAmount; i++) {
            const radians = ((360 * (i / vertexAmount) * Math.PI) / 180);

            const randX = Math.cos(radians) * ((this.radius - Math.random() * difference) + Math.random() * difference);
            const randY = Math.sin(radians) * ((this.radius - Math.random() * difference) + Math.random() * difference);

            vertexArr.push(new Vector(randX, randY));
        }
        const shape = new PolygonShape({ points: vertexArr });
        const mr = new MeshRenderer();
        mr.mesh = new PolygonMesh({ shape, fillStyle: this._asteroidDefaultColor, strokeStyle: '#4BA3C3', glowColor: '#FFFFFF44' });
        const rb = new Rigidbody({});
        const collider = new Collider({ shape })
        mr.mesh.glow = 100;
        mr.mesh.glowColor = 'rgb(23, 86, 118, .35)';
        rb.rotationFriction = 0;
        rb.friction = 0;
        this.setComponent(mr);
        this.setComponent(rb);
        this.setComponent(collider);
    }
    onUpdate() {
        if (this.health <= 0) {
            this.player.score += 1;
            AudioService.addPosition('asteroid-explode', this.translate.position);
            AudioService.play('asteroid-explode');
            this.destroy();
        }
        if (Math.abs(this.player.translate.position.getLength() - this.translate.position.getLength()) > 1200) {
            this.destroy();
        }
    }
    _meshBlink() {
        if (this._isBlinking) return;
        this._isBlinking = true;
        const mr = this.getComponent('meshRenderer') as MeshRenderer;
        const { fillStyle } = mr.mesh;
        mr.mesh.fillStyle = 'white'
        mr.mesh.glow = 1000;
        mr.mesh.glowColor = '#FFFFFF44'
        setTimeout(() => {
            mr.mesh.fillStyle = fillStyle;
            mr.mesh.glow = 100;
            mr.mesh.glowColor = 'rgb(23, 86, 118, .35)';
            this._isBlinking = false;
        }, 100);
    }
    _fillRgba(red: number, green: number, blue: number, alpha: number) {
        const mr = this.getComponent('meshRenderer') as MeshRenderer;
        mr.mesh.fillStyle = `rgba(${red},${green},${blue}, ${alpha})`
    }
    makeDamage(damage: number) {
        this.health -= damage;
        AudioService.addPosition('asteroid-hurt', this.translate.position);
        AudioService.stopAndPlay('asteroid-hurt');
        const healthPercentage = this.health / this.maxHealth;
        this._fillRgba(23, 86, 118, healthPercentage);
        this._meshBlink();
    }
}
