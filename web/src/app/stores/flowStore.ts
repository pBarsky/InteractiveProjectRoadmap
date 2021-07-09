import { makeAutoObservable } from 'mobx';
import { Edge, FlowElement } from 'react-flow-renderer';
import { Milestone } from '../models/milestone';
import milestoneStore from './milestoneStore';

export type Element = FlowElement<Milestone | Edge<Milestone>>;

export interface FlowStore {
	selectedElementId?: number;
	flowElements: Element[];
	areNodesDraggableAndConnectable: boolean;
	addConnection(sourceId: number, targetId: number): void;
	removeConnection(sourceId: number): void;
	updateConnection(sourceId: number, targetId: number): void;
}

export class DefaultFlowStore implements FlowStore {
	private _selectedElementId: number | undefined;

	public constructor () {
		makeAutoObservable(this);
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

	public get flowElements (): Element[] {
		const ret: Element[] = milestoneStore.milestones.map((milestone) => ({
			id: `${milestone.id}`,
			data: milestone,
			type: 'milestone',
			position: { x: milestone.posX, y: milestone.posY }
		}));
		milestoneStore.milestones.forEach((m) => {
			if (!m.connectedToId) {
				return;
			}
			const connection: Edge<Milestone> = {
				id: `${m.id}-${m.connectedToId}`,
				source: m.id.toString(),
				target: m.connectedToId.toString(),
				sourceHandle: null,
				targetHandle: null,
				animated: true,
				style: {
					stroke: 'white',
					strokeWidth: '14px'
				}
			};
			const connectionBackground: Edge<Milestone> = {
				...connection,
				id: `${connection.id}-2`,
				style: { stroke: 'var(--black)', strokeWidth: '14px' },
				animated: false
			};

			ret.push(connectionBackground);
			ret.push(connection);
		});
		return ret;
	}

	public addConnection = (sourceId: number, targetId: number): void => {
		if (!this.checkConnection(sourceId, targetId)) {
			return;
		}
		const milestone = this.getMilestone(sourceId)!;
		milestone.connectedToId = targetId;
		milestoneStore.updateMilestone(milestone);
	};

	public removeConnection (sourceId: number): void {
		const milestone = this.getMilestone(sourceId);
		if (!milestone) {
			console.error('Bad operation. Cannot remove connection of a non existing milestone');
			return;
		}
		if (!milestone.connectedToId) {
			return;
		}
		milestone.connectedToId = null;
		milestoneStore.updateMilestone(milestone);
	}

	public updateConnection (sourceId: number, targetId: number): void {
		if (!this.checkConnection(sourceId, targetId)) {
			return;
		}
		const milestone = this.getMilestone(sourceId)!;
		milestone.connectedToId = targetId;
		milestoneStore.updateMilestone(milestone);
	}

	private getMilestone = (id: number): Milestone | undefined => {
		const milestone = milestoneStore.milestones.find((x) => x.id === id);
		return milestone;
	};

	private checkConnection = (sourceId: number, targetId: number): boolean => {
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
