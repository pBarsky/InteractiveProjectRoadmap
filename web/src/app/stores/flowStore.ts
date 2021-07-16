import { makeAutoObservable } from 'mobx';
import { Connection, Edge, FlowElement } from 'react-flow-renderer';
import { HandleId, Milestone } from '../models/milestone';
import milestoneStore from './milestoneStore';

export type Element = FlowElement<Milestone | Edge<Milestone>>;

type Location = { x: number; y: number };

export interface FlowStore {
	areNodesDraggableAndConnectable: boolean;
	clickOnPaneLocation: Location;
	flowConnections: Edge<Milestone>[];
	flowElements: Element[];
	selectedElementId?: number;
	addConnection(edge: Edge<Milestone> | Connection): boolean;
	removeConnection(sourceId: number): boolean;
	SetClickOnPaneLocation(value: Location): void;
	updateConnection(
		oldEdge: Edge<Milestone> | Connection,
		edge: Edge<Milestone> | Connection
	): boolean;
}

export class DefaultFlowStore implements FlowStore {
	private _selectedElementId: number | undefined;
	private _clickOnPaneLocation: Location = { x: 0, y: 0 };

	public constructor () {
		makeAutoObservable(this);
	}

	public get clickOnPaneLocation (): Location {
		return this._clickOnPaneLocation;
	}

	public set clickOnPaneLocation (value: Location) {
		this._clickOnPaneLocation = { ...value };
	}

	public get areNodesDraggableAndConnectable (): boolean {
		return !milestoneStore.isEditing;
	}

	public get selectedElementId (): number | undefined {
		return this._selectedElementId;
	}

	public set selectedElementId (value: number | undefined) {
		this._selectedElementId = value;
	}

	public SetClickOnPaneLocation = (value: Location): void => {
		this.clickOnPaneLocation = { x: Math.round(value.x), y: Math.round(value.y) };
	};

	public get flowConnections (): Edge<Milestone>[] {
		const connections: Edge<Milestone>[] = [];

		milestoneStore.milestones
			.filter((m) => m.connectedToId)
			.forEach((m) => {
				const connection: Edge<Milestone> = {
					id: `${m.id}-${m.connectedToId}-${m.connectedToSourceHandleId}-${m.connectedToTargetHandleId}`,
					source: m.id.toString(),
					target: m.connectedToId!.toString(),
					sourceHandle: m.connectedToSourceHandleId?.toString(),
					targetHandle: m.connectedToTargetHandleId?.toString(),
					animated: true,
					style: {
						stroke: 'white',
						strokeWidth: '5px'
					}
				};

				const connectionBackground: Edge<Milestone> = {
					...connection,
					id: `${connection.id}-2`,
					style: { stroke: 'var(--black)', strokeWidth: '5px' },
					animated: false
				};

				connections.push(connectionBackground);
				connections.push(connection);
			});
		return connections;
	}

	public get flowElements (): Element[] {
		const ret: Element[] = milestoneStore.milestones.map((milestone) => ({
			id: `${milestone.id}`,
			data: milestone,
			type: 'milestone',
			position: { x: milestone.posX, y: milestone.posY }
		}));
		ret.push(...this.flowConnections);
		return ret;
	}

	public addConnection = (edge: Edge<Milestone> | Connection): boolean => {
		if (!this.checkMilestones(edge)) {
			console.debug('costam niezgodne');
			return false;
		}

		const { source, target, sourceHandle, targetHandle } = edge;

		const sourceId = parseInt(source!);
		const targetId = parseInt(target!);
		const sourceHandleId: HandleId = parseInt(sourceHandle!);
		const targetHandleId: HandleId = parseInt(targetHandle!);
		console.log(sourceHandleId, targetHandleId);

		const milestone = this.getMilestone(sourceId)!;
		const targetMilestone = this.getMilestone(targetId)!;
		const milestoneTargetingThisMilestone = milestoneStore.milestones.find(
			(m) => m.connectedToId === milestone.id
		);

		const isMilestoneAlreadyConnected = milestone.isAlreadyConnectedWith(
			targetMilestone,
			milestoneTargetingThisMilestone,
			sourceHandleId
		);

		if (isMilestoneAlreadyConnected) {
			console.debug('juz polaczone');
			return false;
		}

		if (targetMilestone.connectedToSourceHandleId === targetHandleId) {
			console.debug('juz wychodzi z tego konca');
			return false;
		}

		const milestoneTargetingTargetedMilestone = milestoneStore.milestones.find(
			(m) => m.connectedToId === targetMilestone.id
		);

		if (
			milestone.canTargetConnectWithSelf(
				targetMilestone,
				milestoneTargetingTargetedMilestone,
				sourceHandleId,
				targetHandleId
			)
		) {
			this.connectMilestoneToTarget(
				targetMilestone,
				milestone,
				targetHandleId,
				sourceHandleId
			);
			return true;
		}

		if (!milestoneTargetingTargetedMilestone) {
			console.debug('src -> target');
			this.connectMilestoneToTarget(
				milestone,
				targetMilestone,
				sourceHandleId,
				targetHandleId
			);
			return true;
		}
		return false;
	};

	public removeConnection (sourceId: number): boolean {
		const milestone = this.getMilestone(sourceId);
		if (!milestone) {
			console.error('Bad operation. Cannot remove connection of a non existing milestone');
			return false;
		}

		if (!milestone.connectedToId) {
			return false;
		}

		milestone.connectedToId = null;
		milestone.connectedToSourceHandleId = null;
		milestone.connectedToTargetHandleId = null;
		milestoneStore.updateMilestone(milestone);
		console.debug('usuwanko');
		return true;
	}

	public updateConnection (
		oldEdge: Edge<Milestone> | Connection,
		edge: Edge<Milestone> | Connection
	): boolean {
		if (!oldEdge.source) {
			return false;
		}
		this.removeConnection(parseInt(oldEdge.source));
		if (!this.addConnection(edge)) {
			this.addConnection(oldEdge);
			return false;
		}
		return true;
	}

	private connectMilestoneToTarget (
		milestone: Milestone,
		target: Milestone,
		sourceHandleId: HandleId,
		targetHandleId: HandleId
	): void {
		milestone.connectedToId = target.id;
		milestone.connectedToSourceHandleId = sourceHandleId;
		milestone.connectedToTargetHandleId = targetHandleId;
		milestoneStore.updateMilestone(milestone);
	}

	private getMilestone = (id: number): Milestone | undefined => {
		const milestone = milestoneStore.milestones.find((x) => x.id === id);
		return milestone;
	};

	private checkMilestones = ({
		source,
		target,
		sourceHandle,
		targetHandle
	}: Edge<Milestone> | Connection): boolean => {
		if (!source || !target || !sourceHandle || !targetHandle) {
			return false;
		}

		const sourceId = parseInt(source);
		const targetId = parseInt(target);

		const milestone = this.getMilestone(sourceId);

		if (!milestone) {
			console.error('Bad operation. Cannot add connection from a non existing milestone');
			return false;
		}

		const targetMilestone = this.getMilestone(targetId);
		if (!targetMilestone) {
			console.error('Bad operation. Cannot add connection to a non existing milestone');
			return false;
		}

		return true;
	};
}

export default new DefaultFlowStore();
